from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    birth_date = Column(DateTime, nullable=True)
    guardian_name = Column(String(255), nullable=True)
    guardian_email = Column(String(255), nullable=True)
    learning_preferences = Column(Text, nullable=True)  # JSON string
    interests = Column(Text, nullable=True)  # JSON string
    distractions = Column(Text, nullable=True)  # JSON string
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
