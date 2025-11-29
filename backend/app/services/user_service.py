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
    
    student_id = None
    if user.user_type == "guardian":
        if user.create_student:
            print(f"👶 [CREATE_STUDENT] Criando novo estudante: {user.create_student.full_name}")
            
            existing_student = get_user_by_email(db, user.create_student.email)
            if existing_student:
                raise ValueError(f"Já existe um usuário com o email '{user.create_student.email}'")
            
            student = User(
                full_name=user.create_student.full_name,
                email=user.create_student.email,
                password=user.create_student.password,
                user_type="student",
                birth_date=user.create_student.birth_date,
                guardian_name=user.full_name,
                guardian_email=user.email,
                student_id=None,
                learning_preferences=None,
                interests=None,
                distractions=None,
                firebase_uid=None
            )
            db.add(student)
            db.commit()
            db.refresh(student)
            student_id = student.id
            print(f"✅ [STUDENT_CREATED] Estudante criado: {student.full_name} (ID: {student_id})")
            
        elif user.student_email:
            # Opção 2: Vincular a estudante existente
            student = get_user_by_email(db, user.student_email)
            if not student:
                raise ValueError(f"Estudante com email '{user.student_email}' não encontrado")
            if student.user_type != "student":
                raise ValueError(f"O email informado não pertence a um estudante")
            student_id = student.id
            print(f"🔗 [GUARDIAN_LINK] Responsável será vinculado ao estudante ID {student_id} ({student.full_name})")
        else:
            raise ValueError("Para responsáveis, deve ser informado um email de estudante existente ou dados para criar novo estudante")
    
    elif user.user_type == "student":

        if user.create_guardian:
            print(f"👨‍👩‍👧 [CREATE_GUARDIAN] Criando nova conta de responsável: {user.create_guardian.full_name}")
            
            existing_guardian = get_user_by_email(db, user.create_guardian.email)
            if existing_guardian:
                raise ValueError(f"Já existe um usuário com o email '{user.create_guardian.email}'")
            
            temp_student = User(
                full_name=user.full_name,
                email=user.email,
                password=user.password,
                user_type="student",
                birth_date=user.birth_date,
                guardian_name=user.guardian_name,
                guardian_email=user.guardian_email,
                student_id=None,
                learning_preferences=learning_preferences_json,
                interests=interests_json,
                distractions=user.distractions,
                firebase_uid=getattr(user, 'firebase_uid', None)
            )
            db.add(temp_student)
            db.commit()
            db.refresh(temp_student)
            student_id = temp_student.id
            
            guardian = User(
                full_name=user.create_guardian.full_name,
                email=user.create_guardian.email,
                password=user.create_guardian.password,
                user_type="guardian",
                birth_date=user.create_guardian.birth_date,
                guardian_name=None,
                guardian_email=None,
                student_id=student_id,
                learning_preferences=None,
                interests=None,
                distractions=None,
                firebase_uid=None
            )
            db.add(guardian)
            db.commit()
            db.refresh(guardian)
            print(f"✅ [GUARDIAN_CREATED] Responsável criado: {guardian.full_name} (ID: {guardian.id}) para estudante ID {student_id}")
            
            return temp_student
    
    db_user = User(
        full_name=user.full_name,
        email=user.email,
        password=user.password,
        user_type=user.user_type,
        birth_date=user.birth_date,
        guardian_name=user.guardian_name,
        guardian_email=user.guardian_email,
        student_id=student_id,
        learning_preferences=learning_preferences_json,
        interests=interests_json,
        distractions=user.distractions,
        firebase_uid=getattr(user, 'firebase_uid', None),
        avatar_url=getattr(user, 'avatar_url', None)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    print(f"✅ [USER_CREATED] Usuário criado: {db_user.full_name} (tipo: {db_user.user_type})")
    if student_id:
        print(f"   🔗 Vinculado ao estudante ID {student_id}")
    
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
    if getattr(profile_update, 'avatar_url', None) is not None:
        user.avatar_url = profile_update.avatar_url
    
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

