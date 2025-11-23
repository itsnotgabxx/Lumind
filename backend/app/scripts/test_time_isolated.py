"""
Teste isolado: apenas uma atividade, sem contaminação de dados anteriores
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.database import SessionLocal
from app.models.content_model import ActivityProgress
from app.services.content_service import update_activity_progress

db = SessionLocal()

try:
    print("\n" + "="*60)
    print("🧪 TESTE ISOLADO: Atualização de Tempo Individual")
    print("="*60)
    
    # Limpar dados de teste anteriores
    test_activity = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == 999,
        ActivityProgress.content_id == 888
    ).first()
    if test_activity:
        db.delete(test_activity)
        db.commit()
    
    # PASSO 1: Criar atividade com 11 minutos
    print("\n📝 [PASSO 1] Criar atividade com 11 minutos")
    activity1 = update_activity_progress(
        db=db,
        user_id=999,
        content_id=888,
        status="in_progress",
        progress_percentage=0,
        time_spent=660
    )
    print(f"   Resultado: {activity1.time_spent}min")
    
    # PASSO 2: Atualizar para 14 minutos (11 + 3 novos)
    print("\n📝 [PASSO 2] Atualizar para 14 minutos (11 + 3)")
    activity2 = update_activity_progress(
        db=db,
        user_id=999,
        content_id=888,
        status="in_progress",
        progress_percentage=30,
        time_spent=840
    )
    print(f"   Resultado: {activity2.time_spent}min")
    
    # Verificação
    print("\n" + "="*60)
    if activity2.time_spent == 14:
        print("✅ SUCESSO! Content 99 foi atualizado corretamente de 11 para 14 minutos")
    elif activity2.time_spent == 25:
        print(f"❌ ERRO! O tempo foi SOMADO: 11 + 14 = 25 (deveria ser 14)")
    else:
        print(f"❌ ERRO! Valor inesperado: {activity2.time_spent}min")
    print("="*60)
    
finally:
    # Limpar
    test_activity = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == 999,
        ActivityProgress.content_id == 888
    ).first()
    if test_activity:
        db.delete(test_activity)
        db.commit()
    db.close()
