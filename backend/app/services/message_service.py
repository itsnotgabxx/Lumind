from sqlalchemy.orm import Session
from app.models.content_model import Message
from app.schemas.user_schema import MessageCreate, MessageResponse
from typing import List, Optional
from datetime import datetime

def create_message(db: Session, message: MessageCreate, sender_id: int) -> Message:
    db_message = Message(
        sender_id=sender_id,
        recipient_id=message.recipient_id,
        message=message.message,
        message_type=message.message_type
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_user_messages(db: Session, user_id: int, message_type: Optional[str] = None) -> List[Message]:
    query = db.query(Message).filter(Message.recipient_id == user_id)
    if message_type:
        query = query.filter(Message.message_type == message_type)
    return query.order_by(Message.created_at.desc()).all()

def get_unread_messages_count(db: Session, user_id: int) -> int:
    return db.query(Message).filter(
        Message.recipient_id == user_id,
        Message.is_read == False
    ).count()

def mark_message_as_read(db: Session, message_id: int, user_id: int) -> Optional[Message]:
    message = db.query(Message).filter(
        Message.id == message_id
    ).first()
    
    if message:
        # Verifica se o usuário é o recipient (recebeu a mensagem)
        # OU é o sender (enviou a mensagem - caso do responsável)
        if message.recipient_id == user_id or message.sender_id == user_id:
            message.is_read = True
            db.commit()
            db.refresh(message)
            return message
    
    return None

def mark_conversation_as_read(db: Session, user_id: int, sender_id: int) -> int:
    """Marca todas as mensagens de uma conversa como lidas"""
    messages = db.query(Message).filter(
        Message.recipient_id == user_id,
        Message.sender_id == sender_id,
        Message.is_read == False
    ).all()
    
    for message in messages:
        message.is_read = True
    
    db.commit()
    return len(messages)

def get_guardian_messages_for_student(db: Session, student_id: int) -> List[Message]:
    """Busca mensagens enviadas por responsáveis para um estudante específico"""
    return db.query(Message).filter(
        Message.recipient_id == student_id,
        Message.message_type == "incentive"
    ).order_by(Message.created_at.desc()).all()
