from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.user_schema import ContentItem, UserProgress, RecommendationRequest
from app.services.content_service import (
    get_all_content, get_content_by_id, get_user_activity_progress,
    update_activity_progress, get_user_progress_summary, get_recommendations_for_user
)

router = APIRouter()

@router.get("/content", response_model=List[ContentItem])
async def get_content_list(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lista todo o conteúdo disponível"""
    content = get_all_content(db, skip=skip, limit=limit)
    return content

@router.get("/content/{content_id}", response_model=ContentItem)
async def get_content(
    content_id: int,
    db: Session = Depends(get_db)
):
    """Busca um conteúdo específico por ID"""
    content = get_content_by_id(db, content_id)
    if not content:
        raise HTTPException(
            status_code=404,
            detail="Conteúdo não encontrado"
        )
    return content

@router.get("/users/{user_id}/recommendations", response_model=List[ContentItem])
async def get_recommendations(
    user_id: int,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """Obtém recomendações personalizadas para o usuário"""
    recommendations = get_recommendations_for_user(db, user_id, limit)
    return recommendations

@router.get("/users/{user_id}/progress", response_model=UserProgress)
async def get_user_progress(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Obtém o progresso do usuário"""
    progress = get_user_progress_summary(db, user_id)
    return progress

@router.post("/users/{user_id}/progress/{content_id}")
async def update_progress(
    user_id: int,
    content_id: int,
    status: str,
    progress_percentage: int = 0,
    time_spent: int = 0,
    db: Session = Depends(get_db)
):
    """Atualiza o progresso do usuário em um conteúdo"""
    if status not in ["not_started", "in_progress", "completed"]:
        raise HTTPException(
            status_code=400,
            detail="Status inválido. Use: not_started, in_progress, ou completed"
        )
    
    # Verifica se o conteúdo existe
    content = get_content_by_id(db, content_id)
    if not content:
        raise HTTPException(
            status_code=404,
            detail="Conteúdo não encontrado"
        )
    
    progress = update_activity_progress(
        db, user_id, content_id, status, progress_percentage, time_spent
    )
    
    return {"message": "Progresso atualizado com sucesso", "progress": progress}

@router.get("/users/{user_id}/activities")
async def get_user_activities(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Lista todas as atividades do usuário com progresso"""
    activities = get_user_activity_progress(db, user_id)
    return activities
