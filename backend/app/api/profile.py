"""
Profile API endpoints
- Update user profile
- Upload avatar
"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import logging

from app.db.database import get_db
from app.models.user import User
from app.models.auth import UserResponse
from app.utils.security import get_current_user_id

logger = logging.getLogger(__name__)
router = APIRouter()


class ProfileUpdate(BaseModel):
    """Schema for profile update request"""
    name: Optional[str] = None
    avatar_url: Optional[str] = None


@router.put("", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields if provided
    if profile_data.name is not None:
        user.name = profile_data.name
    
    if profile_data.avatar_url is not None:
        user.avatar_url = profile_data.avatar_url
    
    db.commit()
    db.refresh(user)
    
    logger.info(f"Profile updated for user: {user.email}")
    
    return UserResponse.model_validate(user)
