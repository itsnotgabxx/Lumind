from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas.user_schema import MessageCreate, MessageResponse
from app.services.message_service import (
    create_message, get_user_messages, get_unread_messages_count,
    mark_message_as_read, get_guardian_messages_for_student
)
from app.services.user_service import get_user_by_id

router = APIRouter()

@router.post("/users/{sender_id}/send", response_model=MessageResponse)
async def send_message(
    sender_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    """Envia uma mensagem para outro usuário"""
    # Verifica se o remetente e o destinatário existem
    sender = get_user_by_id(db, sender_id)
    if not sender:
        raise HTTPException(status_code=404, detail="Usuário remetente não encontrado")

    recipient = get_user_by_id(db, message.recipient_id)
    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Usuário destinatário não encontrado"
        )
    
    db_message = create_message(db, message, sender_id)
    return db_message

@router.get("/users/{user_id}/received", response_model=List[MessageResponse])
async def get_received_messages(
    user_id: int,
    message_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lista mensagens recebidas pelo usuário"""
    messages = get_user_messages(db, user_id, message_type)
    return messages

@router.get("/users/{user_id}/unread-count")
async def get_unread_count(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Retorna o número de mensagens não lidas"""
    count = get_unread_messages_count(db, user_id)
    return {"unread_count": count}

@router.post("/users/{user_id}/mark-read/{message_id}")
async def mark_as_read(
    user_id: int,
    message_id: int,
    db: Session = Depends(get_db)
):
    """Marca uma mensagem como lida"""
    message = mark_message_as_read(db, message_id, user_id)
    if not message:
        raise HTTPException(
            status_code=404,
            detail="Mensagem não encontrada"
        )
    return {"message": "Mensagem marcada como lida"}

@router.get("/guardian/{guardian_id}/student/{student_id}", response_model=List[MessageResponse])
async def get_guardian_messages(
    guardian_id: int,
    student_id: int,
    db: Session = Depends(get_db)
):
    """Lista mensagens de incentivo enviadas por responsáveis para um estudante"""
    guardian = get_user_by_id(db, guardian_id)
    if not guardian:
        raise HTTPException(status_code=404, detail="Usuário responsável não encontrado")

    student = get_user_by_id(db, student_id)
    
    if not student:
        raise HTTPException(
            status_code=404,
            detail="Estudante não encontrado"
        )
    
    # Verifica se o usuário é de fato responsável pelo estudante
    if (student.guardian_email != guardian.email and 
        student.guardian_name != guardian.full_name):
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para ver as mensagens deste estudante"
        )
    
    messages = get_guardian_messages_for_student(db, student_id)
    return messages
