"""
Sistema de recomendação personalizado usando técnicas de machine learning.
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from typing import List, Dict, Tuple
import tensorflow as tf
from tensorflow import keras

class ContentRecommender:
    def __init__(self):
        self.scaler = MinMaxScaler()
        self.model = self._build_recommender_model()
        
    def _build_recommender_model(self) -> keras.Model:
        """
        Constrói o modelo de deep learning para recomendação.
        """
        # Modelo de rede neural para recomendação
        model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(12,)),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        return model
        
    def generate_recommendations(self,
                               user_profile: Dict,
                               available_content: List[Dict],
                               n_recommendations: int = 5) -> List[Dict]:
        """
        Gera recomendações personalizadas baseadas no perfil do usuário.
        
        Args:
            user_profile: Perfil cognitivo do usuário
            available_content: Lista de conteúdo disponível
            n_recommendations: Número de recomendações a retornar
            
        Returns:
            Lista de conteúdo recomendado
        """
        if not available_content:
            return []
            
        # Prepara features para cada item de conteúdo
        content_features = []
        for content in available_content:
            # Features do conteúdo
            content_vector = self._create_content_vector(content)
            # Features do usuário
            user_vector = self._create_user_vector(user_profile)
            # Combina features
            features = content_vector + user_vector
            content_features.append(features)
            
        # Normaliza features
        features_scaled = self.scaler.fit_transform(content_features)
        
        # Gera previsões de relevância
        predictions = self.model.predict(features_scaled)
        
        # Ordena conteúdo por relevância prevista
        content_scores = list(zip(available_content, predictions.flatten()))
        content_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Retorna os N mais relevantes
        return [content for content, _ in content_scores[:n_recommendations]]
        
    def _create_content_vector(self, content: Dict) -> List[float]:
        """
        Cria vetor de features para um item de conteúdo.
        """
        # Tipo de conteúdo (one-hot encoding)
        content_type = {
            'video': 0,
            'audio': 0,
            'text': 0,
            'interactive': 0
        }
        content_type[content['type']] = 1
        
        # Dificuldade
        difficulty = content.get('difficulty_level', 1.0)
        
        # Duração/extensão normalizada
        duration = content.get('duration', 0) / 3600  # normaliza para horas
        
        return [
            *content_type.values(),  # 4 features
            difficulty,              # 1 feature
            duration                 # 1 feature
        ]
        
    def _create_user_vector(self, profile: Dict) -> List[float]:
        """
        Cria vetor de features para um perfil de usuário.
        """
        learning_styles = profile['learning_styles']
        
        return [
            learning_styles['visual'],      # 1 feature
            learning_styles['auditory'],    # 1 feature
            learning_styles['interactive'], # 1 feature
            learning_styles['reading'],     # 1 feature
            profile['difficulty_level'],    # 1 feature
            profile['engagement_metrics']['accuracy_rate']  # 1 feature
        ]
        
    def update_model(self, 
                    training_data: List[Tuple[Dict, Dict, int]],
                    epochs: int = 10) -> None:
        """
        Atualiza o modelo com novos dados de treinamento.
        
        Args:
            training_data: Lista de tuplas (perfil_usuario, conteudo, interacao)
            epochs: Número de épocas de treinamento
        """
        if not training_data:
            return
            
        # Prepara dados de treinamento
        X = []
        y = []
        
        for user_profile, content, interaction in training_data:
            content_vector = self._create_content_vector(content)
            user_vector = self._create_user_vector(user_profile)
            features = content_vector + user_vector
            X.append(features)
            y.append(float(interaction > 0))  # interação positiva = 1, negativa = 0
            
        X = np.array(X)
        y = np.array(y)
        
        # Normaliza features
        X_scaled = self.scaler.fit_transform(X)
        
        # Treina o modelo
        self.model.fit(
            X_scaled,
            y,
            epochs=epochs,
            batch_size=32,
            verbose=0
        )