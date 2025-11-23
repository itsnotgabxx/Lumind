from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, LearningPreferencesUpdate, UserProfileUpdate, AccessibilitySettings
from typing import Optional
import json

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    # Converte listas para JSON strings
    learning_preferences_json = None
    interests_json = None
    
    if user.learning_preferences:
        learning_preferences_json = json.dumps(user.learning_preferences)
    if user.interests:
        interests_json = json.dumps(user.interests)
    
    # 👇 ADICIONAR SUPORTE PARA firebase_uid
    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password=user.password, # Senha é salva como texto plano
        birth_date=user.birth_date,
        guardian_name=user.guardian_name,
        guardian_email=user.guardian_email,
        learning_preferences=learning_preferences_json,
        interests=interests_json,
        distractions=user.distractions,
        firebase_uid=getattr(user, 'firebase_uid', None)  # 👈 ADICIONAR ESTA LINHA
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

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

def update_user_streak(db: Session, user_id: int) -> Optional[User]:
    """
    Atualiza o streak de dias consecutivos de estudo do usuário.
    
    Regra:
    - Se foi no mesmo dia: mantém o streak
    - Se foi no dia anterior: incrementa o streak
    - Se foi há 2+ dias: reseta para 1
    """
    from datetime import datetime, timedelta
    
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    today = datetime.utcnow().date()
    
    if user.last_activity_date is None:
        user.streak_days = 1
        user.last_activity_date = datetime.utcnow()
        print(f"   🔥 Primeiro dia de estudo! Streak iniciado em 1 dia")
    else:
        last_activity = user.last_activity_date.date()
        days_diff = (today - last_activity).days
        
        if days_diff == 0:
            print(f"   🔄 Mesma dia - streak mantido em {user.streak_days} dias")
        elif days_diff == 1:
            user.streak_days += 1
            user.last_activity_date = datetime.utcnow()
            print(f"   🔥 Dia consecutivo! Streak incrementado para {user.streak_days} dias")
        else:
            user.streak_days = 1
            user.last_activity_date = datetime.utcnow()
            print(f"   ⚠️  Parou por {days_diff} dias. Streak resetado para 1 dia")
    
    db.commit()
    db.refresh(user)
    return user

