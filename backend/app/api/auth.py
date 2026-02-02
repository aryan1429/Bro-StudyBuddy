"""
Authentication API endpoints
- Register new users
- Login with email/password
- Get current user info
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging

from app.db.database import get_db
from app.models.user import User
from app.models.auth import (
    UserCreate,
    UserLogin,
    Token,
    UserResponse,
    AuthResponse
)
from app.utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user_id
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with email and password.
    Returns user info and JWT token.
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})
    
    logger.info(f"New user registered: {new_user.email}")
    
    return AuthResponse(
        user=UserResponse.model_validate(new_user),
        token=Token(access_token=access_token)
    )


@router.post("/login", response_model=AuthResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password.
    Returns user info and JWT token.
    """
    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    
    logger.info(f"User logged in: {user.email}")
    
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=Token(access_token=access_token)
    )


@router.post("/token", response_model=Token)
async def login_for_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token endpoint.
    Used by Swagger UI for authentication.
    """
    # Find user by email (username field in OAuth2 form)
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return Token(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user info.
    Requires valid JWT token.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.model_validate(user)


# ============= Password Management =============

class PasswordChange(BaseModel):
    """Schema for password change request"""
    current_password: str
    new_password: str


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Change the current user's password.
    Requires valid JWT token and current password verification.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify current password (skip for OAuth users without password)
    if user.hashed_password and not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    # Update password
    user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    logger.info(f"Password changed for user: {user.email}")
    
    return {"message": "Password changed successfully"}


@router.delete("/delete-account")
async def delete_account(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Permanently delete the current user's account and all associated data.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    email = user.email
    
    # Delete user (cascade will handle related data)
    db.delete(user)
    db.commit()
    
    logger.info(f"Account deleted for user: {email}")
    
    return {"message": "Account deleted successfully"}


# ============= Google OAuth =============

from pydantic import BaseModel
import httpx
from app.config import settings


class GoogleAuthURL(BaseModel):
    """Google OAuth authorization URL"""
    auth_url: str


class GoogleAuthCallback(BaseModel):
    """Google OAuth callback with authorization code"""
    code: str


@router.get("/google", response_model=GoogleAuthURL)
async def google_auth():
    """
    Get Google OAuth authorization URL.
    Frontend redirects user to this URL to start OAuth flow.
    """
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.google_client_id}"
        f"&redirect_uri={settings.google_redirect_uri}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
    )
    
    return GoogleAuthURL(auth_url=auth_url)


@router.post("/google/callback", response_model=AuthResponse)
async def google_callback(callback_data: GoogleAuthCallback, db: Session = Depends(get_db)):
    """
    Handle Google OAuth callback.
    Exchange authorization code for tokens and create/login user.
    """
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "code": callback_data.code,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.google_redirect_uri,
                }
            )
            
            if token_response.status_code != 200:
                logger.error(f"Google token error: {token_response.text}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange authorization code"
                )
            
            tokens = token_response.json()
            
            # Get user info from Google
            userinfo_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {tokens['access_token']}"}
            )
            
            if userinfo_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get user info from Google"
                )
            
            google_user = userinfo_response.json()
        
        # Check if user exists (by Google ID or email)
        user = db.query(User).filter(
            (User.google_id == google_user["id"]) | (User.email == google_user["email"])
        ).first()
        
        if user:
            # Update Google ID if not set
            if not user.google_id:
                user.google_id = google_user["id"]
                user.avatar_url = google_user.get("picture")
                db.commit()
                db.refresh(user)
        else:
            # Create new user
            user = User(
                email=google_user["email"],
                name=google_user.get("name", google_user["email"].split("@")[0]),
                hashed_password="",  # No password for OAuth users
                google_id=google_user["id"],
                avatar_url=google_user.get("picture")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Create JWT token
        access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
        
        logger.info(f"Google OAuth login: {user.email}")
        
        return AuthResponse(
            user=UserResponse.model_validate(user),
            token=Token(access_token=access_token)
        )
    
    except httpx.RequestError as e:
        logger.error(f"Google OAuth error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to communicate with Google"
        )

