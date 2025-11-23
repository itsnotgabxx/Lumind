from sqlalchemy.orm import Session
from app.models.content_model import Content, ActivityProgress
from app.schemas.user_schema import ContentItem, ActivityProgress as ActivityProgressSchema
from typing import List, Optional
import json

def get_all_content(db: Session, skip: int = 0, limit: int = 100) -> List[ContentItem]:
    """Retorna todos os conteúdos ativos com content_data parseado"""
    contents = db.query(Content).filter(Content.is_active == True).offset(skip).limit(limit).all()
    
    result = []
    for content in contents:
        content_dict = {
            "id": content.id,
            "title": content.title,
            "description": content.description,
            "type": content.type,
            "source": content.source,
            "content": content.content,
            "image_url": content.image_url,
            "tags": json.loads(content.tags) if content.tags else [],
            "content_data": json.loads(content.content_data) if content.content_data else None,  # 👈 PARSEADO
            "difficulty": content.difficulty,
            "duration": content.duration
        }
        result.append(ContentItem(**content_dict))
    
    return result

def get_content_by_id(db: Session, content_id: int) -> Optional[ContentItem]:
    """Retorna um conteúdo específico com content_data parseado"""
    content = db.query(Content).filter(Content.id == content_id, Content.is_active == True).first()
    
    if not content:
        return None
    
    content_dict = {
        "id": content.id,
        "title": content.title,
        "description": content.description,
        "type": content.type,
        "source": content.source,
        "content": content.content,
        "image_url": content.image_url,
        "tags": json.loads(content.tags) if content.tags else [],
        "content_data": json.loads(content.content_data) if content.content_data else None,  # 👈 PARSEADO
        "difficulty": content.difficulty,
        "duration": content.duration
    }
    
    return ContentItem(**content_dict)

def get_content_by_type(db: Session, content_type: str) -> List[Content]:
    return db.query(Content).filter(Content.type == content_type, Content.is_active == True).all()

def get_user_activity_progress(db: Session, user_id: int) -> List[ActivityProgress]:
    return db.query(ActivityProgress).filter(ActivityProgress.user_id == user_id).all()

def update_activity_progress(db: Session, user_id: int, content_id: int, 
                           status: str, progress_percentage: int = 0, 
                           time_spent: int = 0) -> ActivityProgress:
    print(f"\n📝 [UPDATE] user_id={user_id}, content_id={content_id}, status={status}, progress={progress_percentage}%")
    print(f"   time_spent recebido (segundos): {time_spent}")
    
    import math
    time_spent_minutes = math.ceil(time_spent / 60) if time_spent > 0 else 0
    print(f"   time_spent convertido (minutos): {time_spent_minutes} min (via ceil({time_spent}/60))")
    
    existing_progress = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == user_id,
        ActivityProgress.content_id == content_id
    ).first()
    
    if existing_progress:
        print(f"   Atividade já existe: status anterior={existing_progress.status}, time_spent anterior={existing_progress.time_spent}min")
        
        if existing_progress.status == "completed" and status != "completed":
            print(f"   [PROTEÇÃO] ⚠️  Tentativa de alterar conteúdo concluído bloqueada!")
            print(f"            Status atual: {existing_progress.status} → Tentativa: {status} (REJEITADO)")
            print(f"            💡 Dica: Conteúdo em revisão pode ter tempo adicionado, mas status permanece concluído")
            return existing_progress
        
        if existing_progress.status == "completed" and status == "completed":
            print(f"   👁️ [REVISÃO] Atualizando tempo em conteúdo já concluído")
            old_time = existing_progress.time_spent
            existing_progress.time_spent = max(existing_progress.time_spent, time_spent_minutes)
            print(f"   Tempo revisão: anterior={old_time}min, novo={time_spent_minutes}min → total={existing_progress.time_spent}min")
        else:
            old_time = existing_progress.time_spent
            new_total_time = existing_progress.time_spent + time_spent_minutes
            existing_progress.status = status
            existing_progress.progress_percentage = progress_percentage
            existing_progress.time_spent = new_total_time
            print(f"   time_spent: anterior={old_time}min + novo={time_spent_minutes}min = total {new_total_time}min")
        
        if status == "completed":
            from datetime import datetime
            existing_progress.completed_at = datetime.utcnow()
            print(f"   ✅ Marcado como CONCLUÍDO")

            from app.services.user_service import update_user_streak
            update_user_streak(db, user_id)
        db.commit()
        db.refresh(existing_progress)
        print(f"   Atividade atualizada: status novo={existing_progress.status}, time_spent final={existing_progress.time_spent}min")
        return existing_progress
    else:
    
        print(f"   Criando novo registro de atividade")
        new_progress = ActivityProgress(
            user_id=user_id,
            content_id=content_id,
            status=status,
            progress_percentage=progress_percentage,
            time_spent=time_spent_minutes
        )
        if status == "completed":
            from datetime import datetime
            new_progress.completed_at = datetime.utcnow()
            print(f"   ✅ Novo registro como CONCLUÍDO")

            from app.services.user_service import update_user_streak
            update_user_streak(db, user_id)
        
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        print(f"   Novo registro criado com status={new_progress.status}, time_spent={new_progress.time_spent}min")
        return new_progress

def get_user_progress_summary(db: Session, user_id: int) -> dict:
    activities = get_user_activity_progress(db, user_id)
    
    from app.services.user_service import get_user_by_id
    user = get_user_by_id(db, user_id)
    
    total_activities = len(activities)
    completed_activities = len([a for a in activities if a.status == "completed"])
    in_progress_activities = len([a for a in activities if a.status == "in_progress"])
    total_time_spent = sum([a.time_spent for a in activities])
    
    print(f"📊 [PROGRESS_SUMMARY] user_id={user_id}")
    print(f"   Total: {total_activities} | Completas: {completed_activities} | Em andamento: {in_progress_activities}")
    print(f"   Tempo total gasto: {total_time_spent}min ({total_time_spent // 60}h {total_time_spent % 60}min)")
    print(f"   Detalhes das atividades:")
    for a in activities:
        time_display = f"{a.time_spent // 60}h {a.time_spent % 60}min" if a.time_spent >= 60 else f"{a.time_spent}min"
        print(f"      - Content {a.content_id}: status='{a.status}', progress={a.progress_percentage}%, tempo={time_display}")
    
    progress_percentage = 0
    if total_activities > 0:
        progress_percentage = int((completed_activities / total_activities) * 100)

    achievements = []
    if completed_activities >= 1:
        achievements.append("Explorador Curioso")
    if completed_activities >= 3:
        achievements.append("Mestre dos Vídeos")
    if completed_activities >= 5:
        achievements.append("Leitor Voraz")
    
    streak_days = user.streak_days if user else 0
    
    return {
        "total_activities": total_activities,
        "completed_activities": completed_activities,
        "in_progress_activities": in_progress_activities,
        "total_time_spent": total_time_spent,
        "progress_percentage": progress_percentage,
        "achievements": achievements,
        "streak_days": streak_days
    }

def get_recommendations_for_user(db: Session, user_id: int, limit: int = 5) -> List[ContentItem]:
    
    from app.services.user_service import get_user_by_id
    user = get_user_by_id(db, user_id)
    
    if not user:
        return []
    
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
    
    recommended_content = []
    
    if "video" in learning_preferences or "imagem" in learning_preferences:
        videos = get_content_by_type_parsed(db, "video")
        recommended_content.extend(videos[:2])

    if "leitura" in learning_preferences or "audio" in learning_preferences:
        texts = get_content_by_type_parsed(db, "text")
        recommended_content.extend(texts[:2])
    
    if "interativo" in learning_preferences:
        games = get_content_by_type_parsed(db, "interactive_game")
        recommended_content.extend(games[:2])
    
    if not recommended_content:
        all_content = get_all_content(db, limit=limit)
        recommended_content = all_content[:limit]
    
    return recommended_content[:limit]

def get_content_by_type_parsed(db: Session, content_type: str) -> List[ContentItem]:
    """Retorna conteúdo por tipo com content_data parseado"""
    contents = db.query(Content).filter(Content.type == content_type, Content.is_active == True).all()
    
    result = []
    for content in contents:
        content_dict = {
            "id": content.id,
            "title": content.title,
            "description": content.description,
            "type": content.type,
            "source": content.source,
            "content": content.content,
            "image_url": content.image_url,
            "tags": json.loads(content.tags) if content.tags else [],
            "content_data": json.loads(content.content_data) if content.content_data else None,
            "difficulty": content.difficulty,
            "duration": content.duration
        }
        result.append(ContentItem(**content_dict))
    
    return result