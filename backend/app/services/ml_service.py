"""
Serviço para integrar os componentes de Machine Learning com o restante da aplicação.
"""
from sqlalchemy.orm import Session
from app.ml import get_cognitive_profiler, get_content_recommender, get_interaction_analyzer
from app.services.user_service import get_user_by_id, update_user_profile
from app.services.content_service import get_all_content, get_content_by_id
from app.models.user_model import User
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json

class MLService:
    def __init__(self, db: Session):
        self.db = db
        self.cognitive_profiler = get_cognitive_profiler()
        self.content_recommender = get_content_recommender()
        self.interaction_analyzer = get_interaction_analyzer()
        
    async def process_questionnaire(self, user_id: int, questionnaire_data: Dict) -> Dict:
        """
        Processa o questionário inicial e cria/atualiza o perfil cognitivo.
        """
        # Gera perfil cognitivo
        cognitive_profile = self.cognitive_profiler.create_initial_profile(questionnaire_data)
        
        # Atualiza perfil do usuário
        user = get_user_by_id(self.db, user_id)
        if user:
            user.cognitive_profile = json.dumps(cognitive_profile)
            user.last_profile_update = datetime.now()
            self.db.commit()
            
        return cognitive_profile
        
    async def get_personalized_recommendations(self, 
                                            user_id: int,
                                            limit: int = 5) -> List[Dict]:
        """
        Gera recomendações personalizadas para um usuário.
        """
        # Busca perfil do usuário
        user = get_user_by_id(self.db, user_id)
        if not user or not user.cognitive_profile:
            return []
            
        cognitive_profile = json.loads(user.cognitive_profile)
        
        # Busca conteúdo disponível
        available_content = get_all_content(self.db)
        
        # Gera recomendações
        recommendations = self.content_recommender.generate_recommendations(
            cognitive_profile,
            available_content,
            n_recommendations=limit
        )
        
        return recommendations
        
    async def process_interaction(self,
                               user_id: int,
                               content_id: int,
                               interaction_data: Dict) -> Dict:
        """
        Processa uma nova interação do usuário e atualiza seu perfil.
        """
        # Busca usuário e conteúdo
        user = get_user_by_id(self.db, user_id)
        content = get_content_by_id(self.db, content_id)
        
        if not user or not content:
            return {}
            
        # Analisa a sessão
        session_analysis = self.interaction_analyzer.analyze_session(
            interaction_data,
            content.dict()
        )
        
        # Atualiza perfil cognitivo
        current_profile = json.loads(user.cognitive_profile) if user.cognitive_profile else {}
        
        # Busca interações recentes (últimos 30 dias)
        recent_interactions = self.interaction_analyzer.aggregate_user_interactions(
            user_id,
            user.interactions,
            timeframe=timedelta(days=30)
        )
        
        # Atualiza perfil
        updated_profile = self.cognitive_profiler.update_profile(
            current_profile,
            [interaction_data],  # interação atual
            [recent_interactions]  # dados agregados
        )
        
        # Salva perfil atualizado
        user.cognitive_profile = json.dumps(updated_profile)
        user.last_profile_update = datetime.now()
        self.db.commit()
        
        return {
            'session_analysis': session_analysis,
            'updated_profile': updated_profile
        }
        
    async def update_recommender_model(self) -> None:
        """
        Atualiza o modelo de recomendação com novos dados de treinamento.
        """
        # Busca todas as interações positivas dos últimos 90 dias
        cutoff_date = datetime.now() - timedelta(days=90)
        
        # Prepara dados de treinamento
        training_data = []
        
        # Para cada usuário
        users = self.db.query(User).all()
        for user in users:
            if not user.cognitive_profile:
                continue
                
            profile = json.loads(user.cognitive_profile)
            
            # Filtra interações positivas recentes
            positive_interactions = [
                interaction for interaction in user.interactions
                if interaction.get('success', False) and 
                interaction.get('timestamp') >= cutoff_date
            ]
            
            # Adiciona aos dados de treinamento
            for interaction in positive_interactions:
                content = get_content_by_id(self.db, interaction['content_id'])
                if content:
                    training_data.append((
                        profile,
                        content.dict(),
                        1  # interação positiva
                    ))
        
        # Atualiza modelo se houver dados suficientes
        if training_data:
            self.content_recommender.update_model(training_data)