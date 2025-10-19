from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    birth_date: Optional[datetime] = None
    guardian_name: Optional[str] = None
    guardian_email: Optional[EmailStr] = None
    learning_preferences: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    distractions: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

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
