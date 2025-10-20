from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
import json

class AccessibilitySettings(BaseModel):
    font_size: str = "padrão"  # padrão, medio, grande
    contrast: str = "padrão"  # padrão, alto_contraste
    reduce_animations: bool = False
    text_to_speech: bool = False

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    birth_date: Optional[datetime] = None
    guardian_name: Optional[str] = None
    guardian_email: Optional[EmailStr] = None
    learning_preferences: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    distractions: Optional[str] = None
    accessibility_settings: Optional[AccessibilitySettings] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Novos schemas para funcionalidades adicionais
class LearningPreferencesUpdate(BaseModel):
    learning_preferences: List[str]
    interests: List[str]
    distractions: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    birth_date: Optional[datetime] = None
    guardian_name: Optional[str] = None
    guardian_email: Optional[EmailStr] = None

class ContentItem(BaseModel):
    id: int
    title: str
    description: str
    type: str  # video, text, interactive_game
    source: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = []

    # --- Adicione este validador ---
    @field_validator('tags', mode='before')
    @classmethod
    def parse_tags_json(cls, v):
        if isinstance(v, str): # Se o valor vindo do banco for uma string
            try:
                # Tenta carregar a string como JSON e retornar a lista
                return json.loads(v) 
            except json.JSONDecodeError:
                # Se não for um JSON válido, retorna lista vazia (ou pode logar um aviso)
                print(f"Aviso: Campo 'tags' com valor '{v}' não é um JSON válido.")
                return [] 
        # Se já for uma lista (ou None), retorna o valor original
        return v
    # --- Fim do validador ---

class ActivityProgress(BaseModel):
    content_id: int
    user_id: int
    status: str  # not_started, in_progress, completed
    progress_percentage: int
    time_spent: int  # em minutos
    completed_at: Optional[datetime] = None

class UserProgress(BaseModel):
    total_activities: int
    completed_activities: int
    in_progress_activities: int
    total_time_spent: int
    achievements: List[str]
    progress_percentage: int

class RecommendationRequest(BaseModel):
    user_id: int
    limit: int = 5

class MessageCreate(BaseModel):
    recipient_id: int
    message: str
    message_type: str = "incentive"  # incentive, support, general

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    message: str
    message_type: str
    created_at: datetime
    is_read: bool = False
