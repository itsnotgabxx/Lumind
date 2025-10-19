from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user_schema import (
    UserCreate, UserResponse,
    LearningPreferencesUpdate, UserProfileUpdate, AccessibilitySettings
)
from app.services.user_service import (
    create_user, get_user_by_email, get_user_by_id,
    update_user_preferences, update_user_profile
)

router = APIRouter()

@router.post("/login-by-email", response_model=UserResponse)
async def login_by_email(user_email: str, db: Session = Depends(get_db)):
    """
    Faz o 'login' de um usuário buscando-o pelo email.
    Se o usuário não existir, cria um novo com dados padrão.
    """
    user = get_user_by_email(db, email=user_email)
    if not user:
        # Se o usuário não existe, cria um novo na hora.
        new_user_data = UserCreate(
            email=user_email, full_name="Novo Usuário", password="-"
        )
        user = create_user(db=db, user=new_user_data)
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

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    """Obtém os dados de um usuário pelo ID."""
    db_user = get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return db_user

@router.put("/{user_id}/preferences", response_model=UserResponse)
async def update_preferences(
    user_id: int,
    preferences: LearningPreferencesUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza as preferências de aprendizado do usuário"""
    # Verifica se o usuário existe
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    updated_user = update_user_preferences(db, user_id, preferences)
    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )
    return updated_user
@router.put("/{user_id}/profile", response_model=UserResponse)
async def update_profile(
    user_id: int,
    profile_update: UserProfileUpdate,
    db: Session = Depends(get_db)
):
    """Atualiza o perfil do usuário"""
    # Verifica se o usuário existe
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    updated_user = update_user_profile(db, user_id, profile_update)
    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )
    return updated_user

@router.put("/{user_id}/accessibility", response_model=UserResponse)
async def update_accessibility(
    user_id: int,
    accessibility_settings: AccessibilitySettings,
    db: Session = Depends(get_db)
):
    """Atualiza as configurações de acessibilidade do usuário"""
    # Verifica se o usuário existe
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    from app.services.user_service import update_user_accessibility
    updated_user = update_user_accessibility(db, user_id, accessibility_settings)
    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )
    return updated_user
