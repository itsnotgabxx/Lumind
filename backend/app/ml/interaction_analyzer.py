"""
Módulo para análise de interações e padrões de uso dos usuários.
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta

class InteractionAnalyzer:
    def __init__(self):
        self.interaction_columns = [
            'user_id',
            'content_id',
            'content_type',
            'timestamp',
            'session_time',
            'clicks',
            'scroll_depth',
            'success',
            'errors'
        ]
        
    def analyze_session(self, 
                       session_data: Dict,
                       content_info: Dict) -> Dict:
        """
        Analisa dados de uma sessão de usuário.
        
        Args:
            session_data: Dados brutos da sessão
            content_info: Informações sobre o conteúdo acessado
            
        Returns:
            Dict com métricas da sessão
        """
        # Calcula tempo efetivo (removendo períodos inativos longos)
        effective_time = self._calculate_effective_time(
            session_data.get('timestamps', [])
        )
        
        # Calcula métricas de engajamento
        engagement_metrics = {
            'session_time': effective_time,
            'clicks': len(session_data.get('clicks', [])),
            'scroll_depth': session_data.get('scroll_depth', 0),
            'success': session_data.get('completed', False),
            'errors': len(session_data.get('errors', []))
        }
        
        # Analisa padrões de interação
        interaction_patterns = self._analyze_interaction_patterns(
            session_data,
            content_info
        )
        
        return {
            'engagement_metrics': engagement_metrics,
            'interaction_patterns': interaction_patterns
        }
    
    def _calculate_effective_time(self, timestamps: List[datetime]) -> float:
        """
        Calcula o tempo efetivo de uma sessão, ignorando períodos inativos.
        """
        if not timestamps:
            return 0
            
        total_time = 0
        prev_time = timestamps[0]
        
        for curr_time in timestamps[1:]:
            time_diff = (curr_time - prev_time).total_seconds()
            
            # Ignora períodos inativos (> 5 minutos)
            if time_diff < 300:
                total_time += time_diff
                
            prev_time = curr_time
            
        return total_time
        
    def _analyze_interaction_patterns(self,
                                   session_data: Dict,
                                   content_info: Dict) -> Dict:
        """
        Identifica padrões nas interações do usuário.
        """
        patterns = {
            'preferred_content_parts': [],
            'difficulty_indicators': [],
            'engagement_indicators': []
        }
        
        # Analisa partes do conteúdo mais visitadas
        if 'section_views' in session_data:
            section_views = pd.Series(session_data['section_views'])
            most_viewed = section_views.nlargest(3).index.tolist()
            patterns['preferred_content_parts'] = most_viewed
            
        # Identifica indicadores de dificuldade
        error_sections = session_data.get('error_sections', {})
        if error_sections:
            difficult_sections = [
                section for section, count in error_sections.items()
                if count > 2  # Mais de 2 erros indica dificuldade
            ]
            patterns['difficulty_indicators'] = difficult_sections
            
        # Analisa indicadores de engajamento
        if session_data.get('completed'):
            patterns['engagement_indicators'].append('completion')
            
        if session_data.get('interactions', 0) > content_info.get('avg_interactions', 0):
            patterns['engagement_indicators'].append('high_interaction')
            
        return patterns
        
    def aggregate_user_interactions(self,
                                  user_id: int,
                                  interactions: List[Dict],
                                  timeframe: Optional[timedelta] = None) -> Dict:
        """
        Agrega interações de um usuário em um período específico.
        
        Args:
            user_id: ID do usuário
            interactions: Lista de interações
            timeframe: Período de tempo para análise (opcional)
            
        Returns:
            Dict com métricas agregadas
        """
        if not interactions:
            return {}
            
        # Converte para DataFrame para facilitar análise
        df = pd.DataFrame(interactions, columns=self.interaction_columns)
        
        # Filtra por período se especificado
        if timeframe:
            cutoff = datetime.now() - timeframe
            df = df[df['timestamp'] >= cutoff]
            
        # Agrupa por tipo de conteúdo
        content_type_metrics = df.groupby('content_type').agg({
            'session_time': 'mean',
            'success': 'mean',
            'errors': 'mean'
        }).to_dict()
        
        # Calcula métricas gerais
        overall_metrics = {
            'total_sessions': len(df),
            'avg_session_time': df['session_time'].mean(),
            'success_rate': df['success'].mean(),
            'error_rate': df['errors'].sum() / len(df),
            'content_type_distribution': df['content_type'].value_counts(normalize=True).to_dict()
        }
        
        return {
            'overall_metrics': overall_metrics,
            'content_type_metrics': content_type_metrics
        }