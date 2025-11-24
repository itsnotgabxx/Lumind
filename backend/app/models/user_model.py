from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(255), unique=True, nullable=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    user_type = Column(String(20), default="student")
    birth_date = Column(DateTime, nullable=True)
    guardian_name = Column(String(255), nullable=True)
    guardian_email = Column(String(255), nullable=True)
    student_id = Column(Integer, nullable=True)
    learning_preferences = Column(Text, nullable=True)  # JSON string
    interests = Column(Text, nullable=True)  # JSON string
    distractions = Column(Text, nullable=True)  # JSON string
    accessibility_settings = Column(Text, nullable=True)  # JSON string
    is_active = Column(Boolean, default=True)
    streak_days = Column(Integer, default=0)  # Dias consecutivos de estudo
    last_activity_date = Column(DateTime, nullable=True)  # Data última atividade
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
