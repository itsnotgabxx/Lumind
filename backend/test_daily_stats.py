#!/usr/bin/env python3
"""
Teste da função get_daily_activity_stats
"""

import sys
import os

# Adiciona o diretório raiz ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
import sqlite3

def test_daily_stats():
    """Testa a função de estatísticas diárias"""
    
    # Conecta ao banco SQLite
    db_path = "lumind.db"
    if not os.path.exists(db_path):
        print(f"❌ Arquivo de banco não encontrado: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Busca um usuário existente
    cursor.execute("SELECT id FROM users LIMIT 1")
    user_row = cursor.fetchone()
    
    if not user_row:
        print("❌ Nenhum usuário encontrado no banco")
        return
        
    user_id = user_row[0]
    print(f"🧪 Testando estatísticas diárias para user_id={user_id}")
    
    # Busca atividades dos últimos 7 dias
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    
    cursor.execute("""
        SELECT content_id, status, time_spent, updated_at, created_at, completed_at
        FROM activity_progress 
        WHERE user_id = ? AND updated_at >= ?
        ORDER BY updated_at DESC
    """, (user_id, week_ago.strftime('%Y-%m-%d')))
    
    activities = cursor.fetchall()
    
    print(f"\n📊 Atividades encontradas nos últimos 7 dias: {len(activities)}")
    for i, (content_id, status, time_spent, updated_at, created_at, completed_at) in enumerate(activities):
        print(f"   {i+1}. Content {content_id}: status='{status}', time={time_spent}min, updated={updated_at[:10]}")
    
    # Simula o cálculo diário
    dates = [(today - timedelta(days=i)) for i in range(6, -1, -1)]
    weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    
    print(f"\n📈 Calculando estatísticas por dia:")
    
    for date in dates:
        day_start = datetime.combine(date, datetime.min.time()).strftime('%Y-%m-%d %H:%M:%S')
        day_end = datetime.combine(date, datetime.max.time()).strftime('%Y-%m-%d %H:%M:%S')
        
        # Atividades atualizadas neste dia
        cursor.execute("""
            SELECT DISTINCT content_id, time_spent, status
            FROM activity_progress 
            WHERE user_id = ? AND updated_at >= ? AND updated_at <= ?
        """, (user_id, day_start, day_end))
        
        daily_activities = cursor.fetchall()
        
        # Atividades concluídas neste dia
        cursor.execute("""
            SELECT COUNT(*)
            FROM activity_progress 
            WHERE user_id = ? AND completed_at >= ? AND completed_at <= ? AND status = 'completed'
        """, (user_id, day_start, day_end))
        
        completed_count = cursor.fetchone()[0]
        
        # Calcula tempo (versão FINAL simplificada)
        time_spent = 0
        processed_activities = set()
        
        for content_id, activity_time, status in daily_activities:
            if content_id not in processed_activities:
                processed_activities.add(content_id)
                # VERSÃO FINAL: sempre usa metade do tempo total
                daily_time = activity_time // 2 if activity_time > 0 else 0
                time_spent += daily_time
        
        weekday = weekdays[date.weekday()]
        print(f"   {weekday} ({date}): {time_spent}min, {completed_count} concluídas, {len(processed_activities)} atividades")
    
    conn.close()
    print("\n✅ Teste concluído!")

if __name__ == "__main__":
    test_daily_stats()