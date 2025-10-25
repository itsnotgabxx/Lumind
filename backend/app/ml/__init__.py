"""
Inicialização e configuração do módulo de Machine Learning.
"""
from .cognitive_profile import CognitiveProfiler
from .recommender import ContentRecommender
from .interaction_analyzer import InteractionAnalyzer

# Instâncias globais dos componentes de ML
cognitive_profiler = CognitiveProfiler()
content_recommender = ContentRecommender()
interaction_analyzer = InteractionAnalyzer()

def get_cognitive_profiler() -> CognitiveProfiler:
    """Retorna a instância global do CognitiveProfiler"""
    return cognitive_profiler

def get_content_recommender() -> ContentRecommender:
    """Retorna a instância global do ContentRecommender"""
    return content_recommender

def get_interaction_analyzer() -> InteractionAnalyzer:
    """Retorna a instância global do InteractionAnalyzer"""
    return interaction_analyzer