from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserProfile(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    organization: str
    plant_location: str
    access_tier: str
    notifications_count: int = 0

    class Config:
        from_attributes = True

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=128)
    email: EmailStr
    password: str = Field(..., min_length=8)
    organization: Optional[str] = "Apex Industrial Dynamics · Plant Delta-4"
    plant_location: Optional[str] = "Rotterdam Industrial Basin"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in_seconds: int
    user: UserProfile

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    organization: Optional[str] = None
    plant_location: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)
