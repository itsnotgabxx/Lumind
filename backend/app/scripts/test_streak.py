"""
Script para testar a funcionalidade de streak de dias consecutivos
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.database import SessionLocal
from app.models.user_model import User
from app.models.content_model import ActivityProgress
from app.services.content_service import update_activity_progress, get_user_progress_summary
from datetime import datetime, timedelta

db = SessionLocal()

try:
    print("\n" + "="*70)
    print("🧪 TESTE DE STREAK - Dias Consecutivos de Estudo")
    print("="*70)
    
    # Criar usuário de teste
    test_user_id = 999
    existing_user = db.query(User).filter(User.id == test_user_id).first()
    if not existing_user:
        # Criar usuário de teste
        test_user = User(
            id=test_user_id,
            full_name="Teste Streak",
            email="streak_test@example.com",
            password="test123",
            streak_days=0,
            last_activity_date=None
        )
        db.add(test_user)
        db.commit()
        print("✓ Usuário de teste criado")
    else:
        # Resetar streak para teste
        existing_user.streak_days = 0
        existing_user.last_activity_date = None
        db.commit()
        print("✓ Streak resetado para novo teste")
    
    # TESTE 1: Primeiro dia - Completar atividade
    print("\n📝 [TESTE 1] Primeiro dia - Completar uma atividade")
    print("   Esperado: streak = 1")
    
    update_activity_progress(
        db=db,
        user_id=test_user_id,
        content_id=777,
        status="completed",
        progress_percentage=100,
        time_spent=600
    )
    
    progress = get_user_progress_summary(db, test_user_id)
    user = db.query(User).filter(User.id == test_user_id).first()
    print(f"   ✓ Streak atual: {user.streak_days} dias")
    
    if user.streak_days == 1:
        print("   ✅ PASSOU - Streak iniciado corretamente em 1")
    else:
        print(f"   ❌ FALHOU - Esperado 1, obteve {user.streak_days}")
    
    # TESTE 2: Mesmo dia - Completar outra atividade
    print("\n📝 [TESTE 2] Mesmo dia - Completar outra atividade")
    print("   Esperado: streak mantém em 1")
    
    update_activity_progress(
        db=db,
        user_id=test_user_id,
        content_id=778,
        status="completed",
        progress_percentage=100,
        time_spent=600
    )
    
    user = db.query(User).filter(User.id == test_user_id).first()
    print(f"   ✓ Streak atual: {user.streak_days} dias")
    
    if user.streak_days == 1:
        print("   ✅ PASSOU - Streak mantém em 1 (mesmo dia)")
    else:
        print(f"   ❌ FALHOU - Esperado 1, obteve {user.streak_days}")
    
    # TESTE 3: Simular dia anterior - Completar atividade
    print("\n📝 [TESTE 3] Dia anterior - Simular atividade do dia anterior")
    print("   Esperado: streak incrementa para 2")
    
    # Modificar last_activity_date para ontem
    user.last_activity_date = datetime.utcnow() - timedelta(days=1)
    db.commit()
    
    update_activity_progress(
        db=db,
        user_id=test_user_id,
        content_id=779,
        status="completed",
        progress_percentage=100,
        time_spent=600
    )
    
    user = db.query(User).filter(User.id == test_user_id).first()
    print(f"   ✓ Streak atual: {user.streak_days} dias")
    
    if user.streak_days == 2:
        print("   ✅ PASSOU - Streak incrementou para 2 (dia consecutivo)")
    else:
        print(f"   ❌ FALHOU - Esperado 2, obteve {user.streak_days}")
    
    # TESTE 4: Simular 3+ dias sem atividade - Completar atividade
    print("\n📝 [TESTE 4] 3+ dias sem atividade - Simular pausa de estudo")
    print("   Esperado: streak reseta para 1")
    
    # Modificar last_activity_date para 5 dias atrás
    user.last_activity_date = datetime.utcnow() - timedelta(days=5)
    db.commit()
    
    update_activity_progress(
        db=db,
        user_id=test_user_id,
        content_id=780,
        status="completed",
        progress_percentage=100,
        time_spent=600
    )
    
    user = db.query(User).filter(User.id == test_user_id).first()
    print(f"   ✓ Streak atual: {user.streak_days} dias")
    
    if user.streak_days == 1:
        print("   ✅ PASSOU - Streak resetado para 1 (pausa > 1 dia)")
    else:
        print(f"   ❌ FALHOU - Esperado 1, obteve {user.streak_days}")
    
    print("\n" + "="*70)
    print("✅ Testes concluídos!")
    print("="*70)
    
finally:
    # Limpeza
    activities = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == 999,
        ActivityProgress.content_id.in_([777, 778, 779, 780])
    ).all()
    for activity in activities:
        db.delete(activity)
    db.commit()
    db.close()
