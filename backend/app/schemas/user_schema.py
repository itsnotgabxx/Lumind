from pydantic import BaseModel, EmailStr
from typing import Optional, List
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
