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
    user_type: str = "student"
    birth_date: Optional[datetime] = None
    guardian_name: Optional[str] = None
    guardian_email: Optional[EmailStr] = None
    student_id: Optional[int] = None
    learning_preferences: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    distractions: Optional[str] = None
    accessibility_settings: Optional[AccessibilitySettings] = None

    @field_validator('learning_preferences', 'interests', mode='before')
    @classmethod
    def parse_list_json(cls, v):
        """Converte strings JSON de volta para listas."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v

    @field_validator('accessibility_settings', mode='before')
    @classmethod
    def parse_dict_json(cls, v):
        """Converte a string JSON de configurações de volta para um dict."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return None
        return v

# Schema para criar novo estudante (usado por responsáveis)
class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    birth_date: Optional[datetime] = None

class UserCreate(UserBase):
    password: str
    firebase_uid: Optional[str] = None
    student_email: Optional[str] = None  # 👈 NOVO CAMPO: Email do estudante (para responsáveis)
    create_student: Optional[StudentCreate] = None  # 👈 NOVO CAMPO: Dados para criar estudante


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

    content_data: Optional[Dict[str, Any]] = None  # Para jogos!
    difficulty: Optional[str] = None
    duration: Optional[str] = None

    @field_validator('tags', mode='before')
    @classmethod
    def parse_tags_json(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v) 
            except json.JSONDecodeError:
                print(f"Aviso: Campo 'tags' com valor '{v}' não é um JSON válido.")
                return [] 
        return v
    
    # 👇 ADICIONE ESTE VALIDADOR AQUI
    @field_validator('content_data', mode='before')
    @classmethod
    def parse_content_data_json(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v) 
            except json.JSONDecodeError:
                print(f"Aviso: Campo 'content_data' não é um JSON válido.")
                return None
        return v
    
    class Config:
        from_attributes = True

class ActivityProgress(BaseModel):
    content_id: int
    user_id: int
    status: str  # not_started, in_progress, completed
    progress_percentage: int
    time_spent: int  # em minutos
    completed_at: Optional[datetime] = None

class ActivityProgressWithContent(BaseModel):
    id: int
    content_id: int
    user_id: int
    status: str
    progress_percentage: int
    time_spent: int
    completed_at: Optional[datetime] = None
    content: ContentItem
    
    class Config:
        from_attributes = True

class UserProgress(BaseModel):
    total_activities: int
    completed_activities: int
    in_progress_activities: int
    total_time_spent: int  # em minutos
    achievements: List[str]
    progress_percentage: int
    streak_days: int = 0  # dias consecutivos de estudo

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
