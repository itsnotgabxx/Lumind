from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas.user_schema import MessageCreate, MessageResponse
from app.services.message_service import (
    create_message, get_user_messages, get_unread_messages_count,
    mark_message_as_read, get_guardian_messages_for_student
)
from app.api.routers.auth_router import get_current_user
from app.models.user_model import User

router = APIRouter()

@router.post("/send", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Envia uma mensagem para outro usuário"""
    # Verifica se o destinatário existe
    from app.services.user_service import get_user_by_id
    recipient = get_user_by_id(db, message.recipient_id)
    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Usuário destinatário não encontrado"
        )
    
    db_message = create_message(db, message, current_user.id)
    return db_message

@router.get("/received", response_model=List[MessageResponse])
async def get_received_messages(
    message_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista mensagens recebidas pelo usuário"""
    messages = get_user_messages(db, current_user.id, message_type)
    return messages

@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna o número de mensagens não lidas"""
    count = get_unread_messages_count(db, current_user.id)
    return {"unread_count": count}

@router.post("/mark-read/{message_id}")
async def mark_as_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marca uma mensagem como lida"""
    message = mark_message_as_read(db, message_id, current_user.id)
    if not message:
        raise HTTPException(
            status_code=404,
            detail="Mensagem não encontrada"
        )
    return {"message": "Mensagem marcada como lida"}

@router.get("/guardian/{student_id}", response_model=List[MessageResponse])
async def get_guardian_messages(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista mensagens de incentivo enviadas por responsáveis para um estudante"""
    # Verifica se o usuário atual é responsável pelo estudante
    from app.services.user_service import get_user_by_id
    student = get_user_by_id(db, student_id)
    
    if not student:
        raise HTTPException(
            status_code=404,
            detail="Estudante não encontrado"
        )
    
    # Verifica se o usuário atual é responsável pelo estudante
    if (student.guardian_email != current_user.email and 
        student.guardian_name != current_user.full_name):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para ver as mensagens deste estudante"
        )
    
    messages = get_guardian_messages_for_student(db, student_id)
    return messages
