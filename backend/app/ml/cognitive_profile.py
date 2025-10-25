"""
Módulo responsável por criar e atualizar perfis cognitivos dos usuários
usando técnicas de machine learning.
"""
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pandas as pd
from typing import Dict, List, Tuple
import json

class CognitiveProfiler:
    def __init__(self):
        self.scaler = StandardScaler()
        self.kmeans = KMeans(n_clusters=4, random_state=42)
        
    def create_initial_profile(self, questionnaire_data: Dict) -> Dict:
        """
        Cria um perfil cognitivo inicial baseado nas respostas do questionário.
        
        Args:
            questionnaire_data: Dicionário com respostas do questionário inicial
            
        Returns:
            Dict com o perfil cognitivo inicial
        """
        # Extrai preferências de aprendizado
        learning_styles = {
            'visual': 0,
            'auditory': 0,
            'interactive': 0,
            'reading': 0
        }
        
        # Analisa preferências marcadas
        for pref in questionnaire_data.get('learning_preferences', []):
            if pref == 'imagem' or pref == 'video':
                learning_styles['visual'] += 1
            elif pref == 'audio':
                learning_styles['auditory'] += 1
            elif pref == 'interativo':
                learning_styles['interactive'] += 1
            elif pref == 'leitura':
                learning_styles['reading'] += 1
                
        # Normaliza os valores
        total = sum(learning_styles.values()) or 1
        learning_styles = {k: v/total for k, v in learning_styles.items()}
        
        # Cria perfil inicial
        profile = {
            'learning_styles': learning_styles,
            'difficulty_level': 1.0,
            'engagement_metrics': {
                'avg_session_time': 0,
                'completion_rate': 0,
                'accuracy_rate': 0
            },
            'interests': questionnaire_data.get('interests', []),
            'cluster': None  # Será definido quando houver dados suficientes
        }
        
        return profile
        
    def update_profile(self, 
                      current_profile: Dict,
                      interaction_data: List[Dict],
                      performance_data: List[Dict]) -> Dict:
        """
        Atualiza o perfil cognitivo baseado em novas interações e desempenho.
        
        Args:
            current_profile: Perfil cognitivo atual
            interaction_data: Lista de interações do usuário
            performance_data: Lista de dados de desempenho
            
        Returns:
            Dict com perfil cognitivo atualizado
        """
        if not interaction_data or not performance_data:
            return current_profile
            
        # Processa dados de interação
        df_interactions = pd.DataFrame(interaction_data)
        df_performance = pd.DataFrame(performance_data)
        
        # Calcula métricas de engajamento
        engagement_metrics = {
            'avg_session_time': df_interactions['session_time'].mean(),
            'completion_rate': df_performance['completed'].mean(),
            'accuracy_rate': df_performance['correct_answers'].sum() / df_performance['total_questions'].sum()
        }
        
        # Ajusta nível de dificuldade
        difficulty_adjustment = self._calculate_difficulty_adjustment(
            engagement_metrics['accuracy_rate'],
            engagement_metrics['completion_rate']
        )
        
        new_profile = current_profile.copy()
        new_profile['engagement_metrics'] = engagement_metrics
        new_profile['difficulty_level'] = max(1.0, min(5.0, 
            current_profile['difficulty_level'] + difficulty_adjustment))
        
        # Atualiza estilos de aprendizado baseado nas interações bem-sucedidas
        successful_interactions = df_interactions[df_interactions['success'] == True]
        if not successful_interactions.empty:
            content_types = successful_interactions['content_type'].value_counts(normalize=True)
            
            # Mapeia tipos de conteúdo para estilos de aprendizado
            for content_type, value in content_types.items():
                if content_type in ['video', 'image']:
                    new_profile['learning_styles']['visual'] = \
                        0.7 * new_profile['learning_styles']['visual'] + 0.3 * value
                elif content_type == 'audio':
                    new_profile['learning_styles']['auditory'] = \
                        0.7 * new_profile['learning_styles']['auditory'] + 0.3 * value
                elif content_type == 'interactive':
                    new_profile['learning_styles']['interactive'] = \
                        0.7 * new_profile['learning_styles']['interactive'] + 0.3 * value
                elif content_type == 'text':
                    new_profile['learning_styles']['reading'] = \
                        0.7 * new_profile['learning_styles']['reading'] + 0.3 * value
        
        return new_profile
    
    def _calculate_difficulty_adjustment(self, accuracy_rate: float, completion_rate: float) -> float:
        """
        Calcula o ajuste no nível de dificuldade baseado no desempenho.
        """
        # Se acurácia muito alta, aumenta dificuldade
        if accuracy_rate > 0.85 and completion_rate > 0.7:
            return 0.2
        # Se acurácia muito baixa, diminui dificuldade
        elif accuracy_rate < 0.6 or completion_rate < 0.5:
            return -0.2
        # Mantém nível atual
        return 0.0
        
    def cluster_users(self, user_profiles: List[Dict]) -> List[int]:
        """
        Agrupa usuários em clusters baseado em seus perfis cognitivos.
        """
        if len(user_profiles) < 4:  # Número mínimo para clustering significativo
            return [0] * len(user_profiles)
            
        # Prepara dados para clustering
        features = []
        for profile in user_profiles:
            feature_vector = [
                profile['learning_styles']['visual'],
                profile['learning_styles']['auditory'],
                profile['learning_styles']['interactive'],
                profile['learning_styles']['reading'],
                profile['difficulty_level'],
                profile['engagement_metrics']['avg_session_time'],
                profile['engagement_metrics']['completion_rate'],
                profile['engagement_metrics']['accuracy_rate']
            ]
            features.append(feature_vector)
            
        # Normaliza e aplica clustering
        features_scaled = self.scaler.fit_transform(features)
        clusters = self.kmeans.fit_predict(features_scaled)
        
        return clusters.tolist()