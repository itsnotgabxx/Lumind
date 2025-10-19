from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.db.database import get_db
from app.schemas.user_schema import (
    UserCreate, UserLogin, UserResponse, Token, 
    LearningPreferencesUpdate, UserProfileUpdate, AccessibilitySettings
)
from app.services.user_service import (
    create_user, authenticate_user, get_user_by_email,
    update_user_preferences, update_user_profile
)
from app.models.user_model import User
from app.core.config import settings
import json

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return create_user(db=db, user=user)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/preferences", response_model=UserResponse)
async def update_preferences(
    preferences: LearningPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza as preferências de aprendizado do usuário"""
    updated_user = update_user_preferences(db, current_user.id, preferences)
    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )
    return updated_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza o perfil do usuário"""
    updated_user = update_user_profile(db, current_user.id, profile_update)
    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )
    return updated_user

@router.put("/accessibility", response_model=UserResponse)
async def update_accessibility(
    accessibility_settings: AccessibilitySettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza as configurações de acessibilidade do usuário"""
    from app.services.user_service import update_user_accessibility
    updated_user = update_user_accessibility(db, current_user.id, accessibility_settings)
    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )
    return updated_user
