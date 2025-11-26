from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.user_schema import ContentItem, UserProgress, RecommendationRequest
from app.services.content_service import (
    get_all_content, get_content_by_id, get_user_activity_progress,
    update_activity_progress, get_user_progress_summary, get_recommendations_for_user,
    get_daily_activity_stats
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
    print(f"\n🔍 [GET_PROGRESS] Requisitado para user_id={user_id}")
    progress = get_user_progress_summary(db, user_id)
    print(f"✅ [GET_PROGRESS] Retornando: completed={progress['completed_activities']}, total={progress['total_activities']}")
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
    """Lista todas as atividades do usuário com progresso (incluindo dados do conteúdo)"""
    from app.schemas.user_schema import ActivityProgressWithContent
    
    print(f"\n🔍 [GET_ACTIVITIES] Requisitado para user_id={user_id}")
    activities = get_user_activity_progress(db, user_id)
    print(f"✅ [GET_ACTIVITIES] Retornando {len(activities)} atividades")
    
    activities_with_content = []
    for a in activities:
        print(f"   - Content {a.content_id} ({a.content.title if a.content else 'SEM TÍTULO'}): {a.status}")
        activities_with_content.append(ActivityProgressWithContent.from_orm(a))
    
    return activities_with_content

@router.get("/users/{user_id}/daily-activity")
async def get_user_daily_activity(
    user_id: int,
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Obtém estatísticas de atividade diária dos últimos N dias"""
    print(f"\n🔍 [DAILY_ACTIVITY] Requisitado para user_id={user_id}, days={days}")
    daily_stats = get_daily_activity_stats(db, user_id, days)
    print(f"✅ [DAILY_ACTIVITY] Retornando {len(daily_stats)} dias de dados")
    
    for day in daily_stats:
        print(f"   - {day['weekday']} ({day['date']}): {day['time_spent']}min, {day['completed_activities']} completas")
    
    return daily_stats

@router.get("/content/{content_id}/peers")
async def get_content_peers(
    content_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Obtém outros alunos que estão acompanhando o mesmo conteúdo"""
    from app.models.interaction_model import UserInteraction
    from app.models.user_model import User
    from app.models.content_model import ActivityProgress
    
    # Busca alunos que estão fazendo o mesmo conteúdo
    peers = db.query(
        User.id,
        User.full_name,
        ActivityProgress.status,
        ActivityProgress.progress_percentage
    ).join(
        ActivityProgress, User.id == ActivityProgress.user_id
    ).filter(
        ActivityProgress.content_id == content_id,
        User.id != user_id,
        User.user_type == 'student'
    ).all()
    
    result = []
    for peer in peers:
        result.append({
            "id": peer.id,
            "name": peer.full_name,
            "status": peer.status,
            "progress": peer.progress_percentage
        })
    
    return {"peers": result}
