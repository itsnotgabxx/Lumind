from sqlalchemy.orm import Session
from app.models.content_model import Content, ActivityProgress
from app.schemas.user_schema import ContentItem, ActivityProgress as ActivityProgressSchema
from typing import List, Optional
import json

def get_all_content(db: Session, skip: int = 0, limit: int = 100) -> List[ContentItem]:
    """Retorna todos os conteúdos ativos com content_data parseado"""
    contents = db.query(Content).filter(Content.is_active == True).offset(skip).limit(limit).all()
    
    # Converter para ContentItem com campos parseados
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
    
    # Converter para ContentItem com campos parseados
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
    
    # Converte time_spent de segundos para minutos (recebido do frontend em segundos)
    time_spent_minutes = time_spent // 60 if time_spent > 0 else 0
    
    # Verifica se já existe um progresso para este usuário e conteúdo
    existing_progress = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == user_id,
        ActivityProgress.content_id == content_id
    ).first()
    
    if existing_progress:
        print(f"   Atividade já existe: status anterior={existing_progress.status}")
        existing_progress.status = status
        existing_progress.progress_percentage = progress_percentage
        existing_progress.time_spent += time_spent_minutes
        if status == "completed":
            from datetime import datetime
            existing_progress.completed_at = datetime.utcnow()
            print(f"   ✅ Marcado como CONCLUÍDO")
        db.commit()
        db.refresh(existing_progress)
        print(f"   Atividade atualizada: status novo={existing_progress.status}")
        return existing_progress
    else:
        # Cria novo progresso
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
        
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        print(f"   Novo registro criado com status={new_progress.status}")
        return new_progress

def get_user_progress_summary(db: Session, user_id: int) -> dict:
    activities = get_user_activity_progress(db, user_id)
    
    # Busca o usuário para pegar streak_days
    from app.services.user_service import get_user_by_id
    user = get_user_by_id(db, user_id)
    
    total_activities = len(activities)
    completed_activities = len([a for a in activities if a.status == "completed"])
    in_progress_activities = len([a for a in activities if a.status == "in_progress"])
    total_time_spent = sum([a.time_spent for a in activities])
    
    print(f"📊 [PROGRESS_SUMMARY] user_id={user_id}")
    print(f"   Total: {total_activities} | Completas: {completed_activities} | Em andamento: {in_progress_activities}")
    print(f"   Detalhes das atividades:")
    for a in activities:
        print(f"      - Content {a.content_id}: status='{a.status}' (tipo: {type(a.status).__name__}), progress={a.progress_percentage}%")
    
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
        videos = get_content_by_type_parsed(db, "video")  # 👈 USAR NOVA FUNÇÃO
        recommended_content.extend(videos[:2])
    
    # Se o usuário prefere leitura, busca textos
    if "leitura" in learning_preferences or "audio" in learning_preferences:
        texts = get_content_by_type_parsed(db, "text")  # 👈 USAR NOVA FUNÇÃO
        recommended_content.extend(texts[:2])
    
    # Se o usuário prefere jogos interativos, busca jogos
    if "interativo" in learning_preferences:
        games = get_content_by_type_parsed(db, "interactive_game")  # 👈 USAR NOVA FUNÇÃO
        recommended_content.extend(games[:2])
    
    # Se não há preferências específicas, retorna conteúdo variado
    if not recommended_content:
        all_content = get_all_content(db, limit=limit)
        recommended_content = all_content[:limit]
    
    return recommended_content[:limit]


# 👇 ADICIONE ESTA NOVA FUNÇÃO
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