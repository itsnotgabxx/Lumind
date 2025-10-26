from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False) # Campo mantido para compatibilidade com o frontend, mas não é mais hasheado
    birth_date = Column(DateTime, nullable=True)
    guardian_name = Column(String(255), nullable=True)
    guardian_email = Column(String(255), nullable=True)
    learning_preferences = Column(Text, nullable=True)  # JSON string
    interests = Column(Text, nullable=True)  # JSON string
    distractions = Column(Text, nullable=True)  # JSON string
    accessibility_settings = Column(Text, nullable=True)  # JSON string
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    activity_progress = relationship("ActivityProgress", back_populates="user")
    sent_messages = relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender"
    )
    received_messages = relationship(
        "Message",
        foreign_keys="Message.recipient_id",
        back_populates="recipient"
    )
