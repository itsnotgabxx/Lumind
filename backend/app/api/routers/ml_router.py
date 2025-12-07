"""
Router para endpoints relacionados ao sistema de IA e Machine Learning.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from app.db.database import get_db
from app.services.ml_service import MLService
from app.schemas.user_schema import (
    LearningPreferencesUpdate,
    RecommendationRequest
)
from datetime import datetime

router = APIRouter()

@router.post("/users/{user_id}/questionnaire")
async def process_questionnaire(
    user_id: int,
    preferences: LearningPreferencesUpdate,
    db: Session = Depends(get_db)
):
    """Processa o questionário inicial do usuário e cria seu perfil cognitivo."""
    ml_service = MLService(db)
    try:
        profile = await ml_service.process_questionnaire(user_id, preferences.dict())
        return {
            "message": "Perfil cognitivo criado com sucesso",
            "profile": profile
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar questionário: {str(e)}"
        )

@router.get("/users/{user_id}/recommendations")
async def get_recommendations(
    user_id: int,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """Retorna recomendações personalizadas para o usuário."""
    ml_service = MLService(db)
    try:
        recommendations = await ml_service.get_personalized_recommendations(
            user_id,
            limit=limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar recomendações: {str(e)}"
        )

@router.post("/users/{user_id}/interactions/{content_id}")
async def record_interaction(
    user_id: int,
    content_id: int,
    interaction_data: Dict,
    db: Session = Depends(get_db)
):
    """Registra uma interação do usuário e atualiza seu perfil."""
    ml_service = MLService(db)
    try:
        result = await ml_service.process_interaction(
            user_id,
            content_id,
            interaction_data
        )
        return {
            "message": "Interação processada com sucesso",
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar interação: {str(e)}"
        )

@router.post("/ml/update-model")
async def update_recommender_model(
    db: Session = Depends(get_db)
):
    """Atualiza o modelo de recomendação com novos dados."""
    ml_service = MLService(db)
    try:
        await ml_service.update_recommender_model()
        return {
            "message": "Modelo atualizado com sucesso",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao atualizar modelo: {str(e)}"
        )

@router.get("/ml/status")
async def check_ml_status():
    """Verifica o status do sistema de IA."""
    try:
        from app.ml import get_cognitive_profiler, get_content_recommender, get_interaction_analyzer
        
        profiler = get_cognitive_profiler()
        recommender = get_content_recommender()
        analyzer = get_interaction_analyzer()
        
        return {
            "status": "operational",
            "message": "Sistema de IA está ATIVO e funcionando! 🤖",
            "components": {
                "cognitive_profiler": "✅ Ativo",
                "content_recommender": "✅ Ativo",
                "interaction_analyzer": "✅ Ativo"
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao verificar status da IA: {str(e)}"
        )