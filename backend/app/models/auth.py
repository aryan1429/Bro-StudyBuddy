"""
Pydantic schemas for authentication
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    name: str = Field(..., min_length=1, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Data stored in JWT token"""
    user_id: int
    email: str


class UserResponse(BaseModel):
    """User response (public data only)"""
    id: int
    email: str
    name: str
    is_active: bool
    created_at: datetime
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Response for login/register with user and token"""
    user: UserResponse
    token: Token
