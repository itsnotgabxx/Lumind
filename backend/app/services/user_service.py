from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, LearningPreferencesUpdate, UserProfileUpdate, AccessibilitySettings
from passlib.context import CryptContext
from typing import Optional
import json

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    
    # Converte listas para JSON strings
    learning_preferences_json = None
    interests_json = None
    
    if user.learning_preferences:
        learning_preferences_json = json.dumps(user.learning_preferences)
    if user.interests:
        interests_json = json.dumps(user.interests)
    
    db_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password,
        birth_date=user.birth_date,
        guardian_name=user.guardian_name,
        guardian_email=user.guardian_email,
        learning_preferences=learning_preferences_json,
        interests=interests_json,
        distractions=user.distractions
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def update_user_preferences(db: Session, user_id: int, preferences: LearningPreferencesUpdate) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    user.learning_preferences = json.dumps(preferences.learning_preferences)
    user.interests = json.dumps(preferences.interests)
    user.distractions = preferences.distractions
    
    db.commit()
    db.refresh(user)
    return user

def update_user_profile(db: Session, user_id: int, profile_update: UserProfileUpdate) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    if profile_update.full_name is not None:
        user.full_name = profile_update.full_name
    if profile_update.birth_date is not None:
        user.birth_date = profile_update.birth_date
    if profile_update.guardian_name is not None:
        user.guardian_name = profile_update.guardian_name
    if profile_update.guardian_email is not None:
        user.guardian_email = profile_update.guardian_email
    
    db.commit()
    db.refresh(user)
    return user

def update_user_accessibility(db: Session, user_id: int, accessibility_settings: AccessibilitySettings) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    user.accessibility_settings = json.dumps(accessibility_settings.dict())
    
    db.commit()
    db.refresh(user)
    return user
