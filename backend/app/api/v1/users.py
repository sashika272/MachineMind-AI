from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import UserProfile, UserProfileUpdate
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=StandardResponse[list[UserProfile]])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin endpoint to list all plant engineers and operators."""
    users = db.query(User).all()
    return StandardResponse(
        success=True,
        data=[UserProfile.model_validate(u) for u in users]
    )

@router.put("/{user_id}/access", response_model=StandardResponse[UserProfile])
def update_user_access(
    user_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin endpoint to update user role and access tier."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if "role" in payload:
        user.role = payload["role"]
    if "access_tier" in payload:
        user.access_tier = payload["access_tier"]
    if "is_active" in payload:
        user.is_active = payload["is_active"]
        
    db.commit()
    db.refresh(user)
    return StandardResponse(
        success=True,
        message="User access updated successfully.",
        data=UserProfile.model_validate(user)
    )

@router.get("/profile", response_model=StandardResponse[UserProfile])
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Returns currently authenticated user profile."""
    return StandardResponse(
        success=True,
        data=UserProfile.model_validate(current_user)
    )

@router.put("/profile", response_model=StandardResponse[UserProfile])
def update_user_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates user information and engineering plant location."""
    if profile_in.name:
        current_user.name = profile_in.name
    if profile_in.role:
        current_user.role = profile_in.role
    if profile_in.organization:
        current_user.organization = profile_in.organization
    if profile_in.plant_location:
        current_user.plant_location = profile_in.plant_location

    db.commit()
    db.refresh(current_user)

    return StandardResponse(
        success=True,
        message="Profile updated successfully.",
        data=UserProfile.model_validate(current_user)
    )
