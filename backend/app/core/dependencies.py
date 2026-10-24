import time
from typing import Dict, List, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    """Validates JWT access token and returns authenticated User model."""
    from app.models.user import User
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    
    return user

def get_current_active_admin(current_user = Depends(get_current_user)):
    """Enforces admin or lead role permissions."""
    allowed_roles = ["admin", "Chief Reliability Engineer", "Plant Operations Director"]
    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation requires elevated administrative permissions"
        )
    return current_user

# In-Memory Simple Sliding Window Rate Limiter
class RateLimiter:
    def __init__(self, requests_per_minute: int = 30):
        self.rpm = requests_per_minute
        self.history: Dict[str, List[float]] = {}

    def __call__(self, request: Request):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean timestamps older than 60s
        timestamps = self.history.get(client_ip, [])
        valid_timestamps = [t for t in timestamps if now - t < 60]
        
        if len(valid_timestamps) >= self.rpm:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded ({self.rpm} req/min). Please try again shortly."
            )
        
        valid_timestamps.append(now)
        self.history[client_ip] = valid_timestamps

auth_rate_limiter = RateLimiter(requests_per_minute=20)
standard_rate_limiter = RateLimiter(requests_per_minute=120)
