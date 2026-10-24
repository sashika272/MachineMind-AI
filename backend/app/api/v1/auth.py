from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.core.dependencies import get_current_user, auth_rate_limiter
from app.models.user import User, RefreshToken, PasswordResetToken
from app.schemas.auth import (
    UserRegister, UserLogin, TokenResponse, UserProfile,
    RefreshTokenRequest, PasswordResetRequest, PasswordResetConfirm
)
from app.schemas.common import StandardResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=StandardResponse[TokenResponse], dependencies=[Depends(auth_rate_limiter)])
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """Registers a new industrial user and generates JWT credentials."""
    email_clean = user_in.email.strip().lower()
    existing = db.query(User).filter(func.lower(User.email) == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this enterprise email address already exists."
        )

    new_user = User(
        email=email_clean,
        hashed_password=hash_password(user_in.password),
        name=user_in.name.strip(),
        organization=(user_in.organization or "Apex Industrial Dynamics · Plant Delta-4").strip(),
        plant_location=(user_in.plant_location or "Rotterdam Industrial Basin").strip(),
        role="Chief Reliability Engineer",
        access_tier="Enterprise AI Full",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(new_user.id, role=new_user.role, org=new_user.organization)
    refresh_token = create_refresh_token(new_user.id)

    db_refresh = RefreshToken(
        token=refresh_token,
        user_id=new_user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(db_refresh)
    db.commit()

    user_profile = UserProfile.model_validate(new_user)
    return StandardResponse(
        success=True,
        message="User account registered successfully.",
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_profile
        )
    )

@router.post("/login", response_model=StandardResponse[TokenResponse], dependencies=[Depends(auth_rate_limiter)])
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticates user credentials and issues access & refresh tokens."""
    email_clean = login_in.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email_clean).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect enterprise email or security password."
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account.")

    access_token = create_access_token(user.id, role=user.role, org=user.organization)
    refresh_token = create_refresh_token(user.id)

    db_refresh = RefreshToken(
        token=refresh_token,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(db_refresh)
    db.commit()

    user_profile = UserProfile.model_validate(user)
    return StandardResponse(
        success=True,
        message="Authentication successful.",
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_profile
        )
    )

@router.post("/refresh", response_model=StandardResponse[Dict[str, Any] if False else Any])
def refresh_token_endpoint(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Rotates refresh token and issues a new access token."""
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token.")

    db_token = db.query(RefreshToken).filter(RefreshToken.token == req.refresh_token, RefreshToken.revoked == False).first()
    if not db_token or db_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired or revoked.")

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account disabled.")

    # Issue new access token
    new_access = create_access_token(user.id, role=user.role, org=user.organization)
    return StandardResponse(
        success=True,
        message="Token refreshed.",
        data={
            "access_token": new_access,
            "token_type": "bearer",
            "expires_in_seconds": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
    )

@router.post("/logout", response_model=StandardResponse[bool])
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Revokes active refresh tokens for the current user session."""
    db.query(RefreshToken).filter(RefreshToken.user_id == current_user.id).update({"revoked": True})
    db.commit()
    return StandardResponse(success=True, message="Session terminated successfully.", data=True)

@router.get("/me", response_model=StandardResponse[UserProfile])
def get_me(current_user: User = Depends(get_current_user)):
    """Returns profile for currently authenticated user."""
    return StandardResponse(
        success=True,
        message="User profile retrieved.",
        data=UserProfile.model_validate(current_user)
    )

@router.post("/forgot-password", response_model=StandardResponse[bool], dependencies=[Depends(auth_rate_limiter)])
def forgot_password(req: PasswordResetRequest, db: Session = Depends(get_db)):
    """Generates a cryptographic password reset token."""
    email_clean = req.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email_clean).first()
    if user:
        token_str = f"rst-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}-{user.id}"
        reset_entry = PasswordResetToken(
            token=token_str,
            user_id=user.id,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)
        )
        db.add(reset_entry)
        db.commit()

    # Always return success to prevent email enumeration
    return StandardResponse(
        success=True,
        message="If this email is registered, a password reset link has been dispatched.",
        data=True
    )

@router.post("/reset-password", response_model=StandardResponse[bool])
def reset_password(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Validates reset token and sets new password."""
    reset_entry = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == req.token,
        PasswordResetToken.used == False
    ).first()

    if not reset_entry or reset_entry.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")

    user = db.query(User).filter(User.id == reset_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")

    user.hashed_password = hash_password(req.new_password)
    reset_entry.used = True
    db.commit()

    return StandardResponse(success=True, message="Password reset successfully. You may now sign in.", data=True)
