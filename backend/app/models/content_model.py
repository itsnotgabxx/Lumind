from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Content(Base):
    __tablename__ = "content"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # video, text, interactive_game
    source = Column(Text, nullable=True)  # URL para vídeos, conteúdo para textos
    content = Column(Text, nullable=True)  # Conteúdo textual
    image_url = Column(String(500), nullable=True)
    tags = Column(Text, nullable=True)  # JSON string com tags

    content_data = Column(Text, nullable=True)  # 👈 ADICIONE ESTA LINHA
    difficulty = Column(String(50), nullable=True)  # 👈 E ESTA TAMBÉM
    duration = Column(String(50), nullable=True)  # 👈 E ESTA

     # 👇 ADICIONAR ESTES CAMPOS
    difficulty_level = Column(Integer, default=1)
    learning_style_weights = Column(Text, nullable=True)
    prerequisites = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ActivityProgress(Base):
    __tablename__ = "activity_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_id = Column(Integer, ForeignKey("content.id"), nullable=False)
    status = Column(String(20), default="not_started")  # not_started, in_progress, completed
    progress_percentage = Column(Integer, default=0)
    time_spent = Column(Integer, default=0)  # em minutos
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    user = relationship("User", back_populates="activity_progress")
    content = relationship("Content")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    message_type = Column(String(20), default="general")  # incentive, support, general
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relacionamentos
    sender = relationship(
        "User",
        foreign_keys=[sender_id],
        back_populates="sent_messages"
    )
    recipient = relationship(
        "User",
        foreign_keys=[recipient_id],
        back_populates="received_messages"
    )
