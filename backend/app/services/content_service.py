from sqlalchemy.orm import Session
from app.models.content_model import Content, ActivityProgress
from app.schemas.user_schema import ContentItem, ActivityProgress as ActivityProgressSchema
from typing import List, Optional
import json

def get_all_content(db: Session, skip: int = 0, limit: int = 100) -> List[Content]:
    return db.query(Content).filter(Content.is_active == True).offset(skip).limit(limit).all()

def get_content_by_id(db: Session, content_id: int) -> Optional[Content]:
    return db.query(Content).filter(Content.id == content_id, Content.is_active == True).first()

def get_content_by_type(db: Session, content_type: str) -> List[Content]:
    return db.query(Content).filter(Content.type == content_type, Content.is_active == True).all()

def get_user_activity_progress(db: Session, user_id: int) -> List[ActivityProgress]:
    return db.query(ActivityProgress).filter(ActivityProgress.user_id == user_id).all()

def update_activity_progress(db: Session, user_id: int, content_id: int, 
                           status: str, progress_percentage: int = 0, 
                           time_spent: int = 0) -> ActivityProgress:
    # Verifica se já existe um progresso para este usuário e conteúdo
    existing_progress = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == user_id,
        ActivityProgress.content_id == content_id
    ).first()
    
    if existing_progress:
        existing_progress.status = status
        existing_progress.progress_percentage = progress_percentage
        existing_progress.time_spent += time_spent
        if status == "completed":
            from datetime import datetime
            existing_progress.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_progress)
        return existing_progress
    else:
        # Cria novo progresso
        new_progress = ActivityProgress(
            user_id=user_id,
            content_id=content_id,
            status=status,
            progress_percentage=progress_percentage,
            time_spent=time_spent
        )
        if status == "completed":
            from datetime import datetime
            new_progress.completed_at = datetime.utcnow()
        
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        return new_progress

def get_user_progress_summary(db: Session, user_id: int) -> dict:
    activities = get_user_activity_progress(db, user_id)
    
    total_activities = len(activities)
    completed_activities = len([a for a in activities if a.status == "completed"])
    in_progress_activities = len([a for a in activities if a.status == "in_progress"])
    total_time_spent = sum([a.time_spent for a in activities])
    
    progress_percentage = 0
    if total_activities > 0:
        progress_percentage = int((completed_activities / total_activities) * 100)
    
    # Simulação de conquistas baseadas no progresso
    achievements = []
    if completed_activities >= 1:
        achievements.append("Explorador Curioso")
    if completed_activities >= 3:
        achievements.append("Mestre dos Vídeos")
    if completed_activities >= 5:
        achievements.append("Leitor Voraz")
    
    return {
        "total_activities": total_activities,
        "completed_activities": completed_activities,
        "in_progress_activities": in_progress_activities,
        "total_time_spent": total_time_spent,
        "progress_percentage": progress_percentage,
        "achievements": achievements
    }

def get_recommendations_for_user(db: Session, user_id: int, limit: int = 5) -> List[Content]:
    # Busca o usuário para obter suas preferências
    from app.services.user_service import get_user_by_id
    user = get_user_by_id(db, user_id)
    
    if not user:
        return []
    
    # Converte as preferências de JSON string para lista
    learning_preferences = []
    interests = []
    
    if user.learning_preferences:
        try:
            learning_preferences = json.loads(user.learning_preferences)
        except:
            learning_preferences = []
    
    if user.interests:
        try:
            interests = json.loads(user.interests)
        except:
            interests = []
    
    # Busca conteúdo baseado nas preferências
    recommended_content = []
    
    # Se o usuário prefere vídeos, busca vídeos
    if "video" in learning_preferences or "imagem" in learning_preferences:
        videos = get_content_by_type(db, "video")
        recommended_content.extend(videos[:2])
    
    # Se o usuário prefere leitura, busca textos
    if "leitura" in learning_preferences or "audio" in learning_preferences:
        texts = get_content_by_type(db, "text")
        recommended_content.extend(texts[:2])
    
    # Se o usuário prefere jogos interativos, busca jogos
    if "interativo" in learning_preferences:
        games = get_content_by_type(db, "interactive_game")
        recommended_content.extend(games[:2])
    
    # Se não há preferências específicas, retorna conteúdo variado
    if not recommended_content:
        all_content = get_all_content(db, limit=limit)
        recommended_content = all_content[:limit]
    
    return recommended_content[:limit]
