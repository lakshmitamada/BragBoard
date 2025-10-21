from typing import Optional
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import jwt, JWTError
from passlib.context import CryptContext

from .database import get_db
from .models import User
from .config import settings

# ---------------------------
# OAuth2 scheme
# ---------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---------------------------
# Password hashing
# ---------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

<<<<<<< HEAD
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against the hashed password.
    Truncate to 72 characters due to bcrypt limit.
    """
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash a password with bcrypt.
    Truncate to 72 characters due to bcrypt limit.
    """
    return pwd_context.hash(password[:72])
=======

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f

# ---------------------------
# Authenticate user
# ---------------------------
async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
<<<<<<< HEAD
    """
    Authenticate a user by email and password.
    Returns the user if credentials are correct, otherwise None.
    """
=======
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user or not verify_password(password, user.password):
        return None
    return user

<<<<<<< HEAD
# ---------------------------
# Token creation
# ---------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    """
=======

# ---------------------------
# Token creation
# ---------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

<<<<<<< HEAD
def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT refresh token.
    """
=======

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

<<<<<<< HEAD
=======

>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
# ---------------------------
# Get current user
# ---------------------------
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
<<<<<<< HEAD
    """
    Get the current user from the JWT token.
    """
=======
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise credentials_exception
    return user

<<<<<<< HEAD
=======

>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
# ---------------------------
# Get current admin (or superadmin)
# ---------------------------
async def get_current_admin_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    """
    Returns current user if role is admin or superadmin.
    """
    user = await get_current_user(token, db)
    if user.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user

<<<<<<< HEAD
=======

>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
# ---------------------------
# Get only superadmin
# ---------------------------
async def get_current_superadmin(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    """
    Returns current user if role is superadmin.
    """
    user = await get_current_user(token, db)
    if user.role != "superadmin":
        raise HTTPException(status_code=403, detail="Superadmin privileges required")
    return user
