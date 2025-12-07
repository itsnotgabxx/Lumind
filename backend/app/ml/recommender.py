"""
Sistema de recomendação personalizado usando técnicas de machine learning.
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from typing import List, Dict, Tuple
try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Dropout
    TENSORFLOW_AVAILABLE = True
except ImportError:
    print("⚠️ TensorFlow não disponível, usando modo fallback")
    TENSORFLOW_AVAILABLE = False

class ContentRecommender:
    def __init__(self):
        self.scaler = MinMaxScaler()
        self.model = self._build_recommender_model()
        self.is_trained = False
        
    def _build_recommender_model(self):
        """
        Constrói o modelo de deep learning para recomendação.
        """
        if not TENSORFLOW_AVAILABLE:
            return None
            
        # Modelo de rede neural para recomendação
        # Input: 7 features de conteúdo + 6 features de usuário = 13 features
        model = Sequential([
            Dense(64, activation='relu', input_shape=(13,)),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1, activation='sigmoid')
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
        
        try:
            # Prepara features para cada item de conteúdo
            content_features = []
            valid_content = []
            
            for content in available_content:
                try:
                    # Features do conteúdo
                    content_vector = self._create_content_vector(content)
                    # Features do usuário
                    user_vector = self._create_user_vector(user_profile)
                    # Combina features
                    features = content_vector + user_vector
                    content_features.append(features)
                    valid_content.append(content)
                except Exception as e:
                    print(f"⚠️ Erro ao processar conteúdo {content.get('id', 'unknown')}: {str(e)}")
                    continue
            
            if not content_features:
                return []
                
            # Normaliza features
            features_scaled = self.scaler.fit_transform(content_features)
            
            # Gera previsões de relevância
            if TENSORFLOW_AVAILABLE and self.is_trained and self.model is not None:
                # Usa modelo de deep learning treinado
                predictions = self.model.predict(features_scaled, verbose=0).flatten()
            else:
                # Usa heurística baseada em similaridade de perfil
                predictions = self._calculate_similarity_scores(features_scaled, user_profile)
            
            # Ordena conteúdo por relevância prevista
            content_scores = list(zip(valid_content, predictions))
            content_scores.sort(key=lambda x: x[1], reverse=True)
            
            # Retorna os N mais relevantes
            return [content for content, _ in content_scores[:n_recommendations]]
        except Exception as e:
            print(f"❌ Erro ao gerar recomendações: {str(e)}")
            # Fallback: retorna conteúdo aleatório
            return available_content[:n_recommendations]
    
    def _calculate_similarity_scores(self, features_scaled: np.ndarray, user_profile: Dict) -> np.ndarray:
        """
        Calcula scores de similaridade quando o modelo não está treinado.
        """
        # Extrai preferências do usuário
        learning_styles = user_profile.get('learning_styles', {})
        difficulty_pref = user_profile.get('difficulty_level', 1.0)
        
        scores = []
        for features in features_scaled:
            # Score baseado em matching de tipo de conteúdo com estilo de aprendizado
            # Features 0-4 são tipos de conteúdo (one-hot)
            type_score = 0
            if features[0] > 0:  # video
                type_score = learning_styles.get('visual', 0.25)
            elif features[1] > 0:  # audio
                type_score = learning_styles.get('auditory', 0.25)
            elif features[2] > 0:  # text
                type_score = learning_styles.get('reading', 0.25)
            elif features[3] > 0:  # interactive
                type_score = learning_styles.get('interactive', 0.25)
            elif features[4] > 0:  # game
                type_score = learning_styles.get('interactive', 0.25)
            
            # Score de dificuldade (penaliza muito fácil ou muito difícil)
            difficulty_feature = features[5] * 5.0  # desnormaliza
            difficulty_score = 1.0 - abs(difficulty_feature - difficulty_pref) / 5.0
            
            # Score final (média ponderada)
            final_score = 0.7 * type_score + 0.3 * difficulty_score
            scores.append(final_score)
        
        return np.array(scores)
        
    def _create_content_vector(self, content: Dict) -> List[float]:
        """
        Cria vetor de features para um item de conteúdo.
        """
        # Tipo de conteúdo (one-hot encoding)
        content_type_encoding = {
            'video': 0,
            'audio': 0,
            'text': 0,
            'interactive': 0,
            'game': 0
        }
        
        # Mapeia o tipo do conteúdo, com fallback
        ctype = content.get('type', 'text').lower()
        if ctype in content_type_encoding:
            content_type_encoding[ctype] = 1
        else:
            content_type_encoding['text'] = 1  # Default
        
        # Dificuldade (normaliza entre 0 e 1)
        difficulty = content.get('difficulty', content.get('difficulty_level', 1.0))
        difficulty = min(max(difficulty / 5.0, 0.0), 1.0)
        
        # Duração/extensão normalizada
        duration = content.get('duration', 0)
        if isinstance(duration, str):
            duration = 0
        duration = min(duration / 3600, 1.0)  # normaliza para horas, max 1 hora
        
        return list(content_type_encoding.values()) + [difficulty, duration]  # 7 features total
        
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
        if not TENSORFLOW_AVAILABLE or self.model is None:
            print("⚠️ TensorFlow não disponível, modelo não pode ser treinado")
            return
            
        if not training_data or len(training_data) < 10:
            print(f"⚠️ Dados insuficientes para treinar modelo ({len(training_data) if training_data else 0} exemplos)")
            return
            
        try:
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
            
            # Treina o modelo com TensorFlow/Keras
            self.model.fit(
                X_scaled,
                y,
                epochs=epochs,
                batch_size=32,
                verbose=0
            )
            self.is_trained = True
            print(f"✅ Modelo de deep learning treinado com {len(training_data)} exemplos usando TensorFlow")
        except Exception as e:
            print(f"❌ Erro ao treinar modelo: {str(e)}")