"""
Modelo para interações do usuário.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class UserInteraction(Base):
    __tablename__ = "user_interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_id = Column(Integer, ForeignKey("content.id"), nullable=False)
    interaction_type = Column(String(50), nullable=False)  # click, view, complete, error
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    data = Column(Text, nullable=True)  # JSON string com dados adicionais
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relacionamentos
    user = relationship("User", backref="interactions")
    content = relationship("Content")