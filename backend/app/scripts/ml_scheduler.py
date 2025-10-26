"""
Script para executar tarefas periódicas relacionadas à IA.
"""
import schedule
import time
import json
import asyncio
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.ml_service import MLService
from app.models.user_model import User
from app.models.content_model import Content, Message
from app.models.interaction_model import UserInteraction
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def update_ml_models():
    """Atualiza os modelos de machine learning com novos dados"""
    logger.info("Iniciando atualização dos modelos de ML...")
    
    try:
        db = SessionLocal()
        ml_service = MLService(db)
        
        # Atualiza modelo de recomendação
        await ml_service.update_recommender_model()
        
        # Atualiza perfis cognitivos
        users = db.query(User).filter(
            User.last_profile_update < datetime.now() - timedelta(days=1)
        ).all()
        
        for user in users:
            # Busca interações recentes
            recent_interactions = db.query(UserInteraction).filter(
                UserInteraction.user_id == user.id,
                UserInteraction.timestamp > datetime.now() - timedelta(days=30)
            ).all()
            
            if recent_interactions:
                # Processa interações e atualiza perfil
                await ml_service.process_interactions(
                    user.id,
                    [interaction.dict() for interaction in recent_interactions]
                )
        
        logger.info("Atualização dos modelos concluída com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro durante atualização dos modelos: {str(e)}")
    finally:
        db.close()

async def analyze_learning_patterns():
    """Analisa padrões de aprendizado globais"""
    logger.info("Iniciando análise de padrões de aprendizado...")
    
    try:
        db = SessionLocal()
        ml_service = MLService(db)
        
        # Análise de efetividade do conteúdo
        content_effectiveness = await ml_service.analyze_content_effectiveness()
        
        # Análise de padrões de dificuldade
        difficulty_patterns = await ml_service.analyze_difficulty_patterns()
        
        # Atualiza metadados do conteúdo com base nas análises
        for content_id, metrics in content_effectiveness.items():
            content = db.query(Content).filter(Content.id == content_id).first()
            if content:
                content.difficulty_level = metrics['suggested_difficulty']
                content.learning_style_weights = json.dumps(metrics['style_weights'])
        
        db.commit()
        logger.info("Análise de padrões concluída com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro durante análise de padrões: {str(e)}")
    finally:
        db.close()

async def generate_insight_reports():
    """Gera relatórios de insights baseados em IA"""
    logger.info("Gerando relatórios de insights...")
    
    try:
        db = SessionLocal()
        ml_service = MLService(db)
        
        # Gera insights por usuário
        users = db.query(User).filter(User.is_active == True).all()
        for user in users:
            insights = await ml_service.generate_user_insights(user.id)
            
            if insights:
                # Cria mensagem com insights para o usuário
                message = Message(
                    sender_id=1,  # ID do sistema
                    recipient_id=user.id,
                    message_type="insight",
                    message=json.dumps(insights)
                )
                db.add(message)
        
        db.commit()
        logger.info("Relatórios de insights gerados com sucesso!")
        
    except Exception as e:
        logger.error(f"Erro durante geração de insights: {str(e)}")
    finally:
        db.close()

async def run_scheduled_task(task_func):
    """Executor de tarefas assíncronas para o scheduler"""
    await task_func()

def main():
    # Agenda tarefas periódicas usando um wrapper assíncrono
    schedule.every().day.at("02:00").do(
        lambda: asyncio.run(run_scheduled_task(update_ml_models))
    )
    schedule.every().day.at("03:00").do(
        lambda: asyncio.run(run_scheduled_task(analyze_learning_patterns))
    )
    schedule.every().monday.at("08:00").do(
        lambda: asyncio.run(run_scheduled_task(generate_insight_reports))
    )
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()