"""
Script para testar se o status de conclusão está sendo salvo corretamente
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.database import SessionLocal
from app.models.content_model import ActivityProgress
from sqlalchemy import text

db = SessionLocal()

try:
    print("\n🔍 [TESTE DE CONCLUSÃO]")
    
    # Buscar atividades do usuário 2
    activities = db.query(ActivityProgress).filter(ActivityProgress.user_id == 2).all()
    print(f"\n✓ Total de atividades para User 2: {len(activities)}")
    
    for activity in activities:
        print(f"  - Content {activity.content_id}: status='{activity.status}' | type={type(activity.status)}")
    
    # Tentar atualizar uma para 'completed'
    if activities:
        print(f"\n📝 Atualizando primeira atividade para 'completed'...")
        activity = activities[0]
        print(f"   Antes: status='{activity.status}' (type={type(activity.status).__name__})")
        
        activity.status = "completed"
        db.commit()
        db.refresh(activity)
        
        print(f"   Depois: status='{activity.status}' (type={type(activity.status).__name__})")
        
        # Consultar a mesma atividade novamente diretamente do banco
        print(f"\n🔄 Consultando banco de dados diretamente...")
        result = db.query(ActivityProgress).filter(
            ActivityProgress.user_id == 2,
            ActivityProgress.content_id == activity.content_id
        ).first()
        
        if result:
            print(f"   Status no banco: '{result.status}' (type={type(result.status).__name__})")
        
        # Query raw SQL para debugar
        print(f"\n🔍 Query RAW SQL...")
        raw_result = db.execute(text("SELECT id, user_id, content_id, status FROM activity_progress WHERE user_id = 2 AND content_id = :cid"), {"cid": activity.content_id}).fetchone()
        if raw_result:
            print(f"   Raw result: id={raw_result[0]}, user={raw_result[1]}, content={raw_result[2]}, status='{raw_result[3]}'")
        
        # Checar com == comparison
        print(f"\n🔎 Teste de comparação:")
        print(f"   result.status == 'completed': {result.status == 'completed'}")
        print(f"   result.status == \"completed\": {result.status == 'completed'}")
        print(f"   repr(result.status): {repr(result.status)}")
    
finally:
    db.close()
    print("\n✅ Teste completo!")
