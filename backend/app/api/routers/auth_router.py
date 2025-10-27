from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.firebase_config import verify_firebase_token  # 👈 ADICIONAR ESTE IMPORT
from app.services.user_service import create_user
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
    """
    user = get_user_by_email(db, email=user_email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado. Por favor, cadastre-se primeiro."
        )
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

@router.post("/google")
async def google_login(data: dict, db: Session = Depends(get_db)):
    """
    Faz login com Google usando o token do Firebase.
    Se o usuário não existir, retorna indicador para cadastro.
    """
    token = data.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token não enviado")

    try:
        # Verificar o token do Firebase
        decoded_token = verify_firebase_token(token)
        
        # Extrair dados do token
        email = decoded_token.get("email")
        name = decoded_token.get("name", "Usuário Google")
        firebase_uid = decoded_token.get("uid")
        picture = decoded_token.get("picture", "")
        
        print(f"✅ Token Firebase válido! Email: {email}, UID: {firebase_uid}")

        # Procura usuário existente
        user = get_user_by_email(db, email=email)
        
        if not user:
            # 👇 USUÁRIO NOVO - retorna dados para cadastro
            print(f"📝 Usuário novo detectado: {email}")
            return {
                "is_new_user": True,
                "google_data": {
                    "email": email,
                    "full_name": name,
                    "firebase_uid": firebase_uid,
                    "picture": picture
                }
            }
        else:
            # 👇 USUÁRIO EXISTENTE - retorna dados do usuário
            print(f"✅ Usuário existente encontrado: {email}")
            return {
                "is_new_user": False,
                "user": user
            }

    except ValueError as e:
        print(f"❌ Token inválido: {e}")
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    except Exception as e:
        print(f"❌ Erro ao processar login Google: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
    

    
@router.post("/google/complete-registration", response_model=UserResponse)
async def complete_google_registration(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Completa o cadastro de um usuário que fez login com Google.
    """
    # Verifica se o usuário já existe
    existing_user = get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Este email já está cadastrado"
        )
    
    # Cria o novo usuário
    new_user = create_user(db=db, user=user_data)
    print(f"✅ Cadastro Google completo: {new_user.email}")
    
    return new_user