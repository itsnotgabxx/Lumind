"""
Script para simular fluxo completo POST + GET
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.db.database import SessionLocal
from app.services.content_service import update_activity_progress, get_user_progress_summary

db = SessionLocal()

try:
    print("\n═══════════════════════════════════════════════")
    print("🧪 TESTE COMPLETO: POST UPDATE + GET PROGRESS")
    print("═══════════════════════════════════════════════")
    
    # STEP 1: GET inicial
    print("\n📊 [STEP 1] GET /users/2/progress (ANTES de marcar como concluído)")
    before = get_user_progress_summary(db, 2)
    print(f"   Resultado: completed={before['completed_activities']}, total={before['total_activities']}")
    
    # STEP 2: POST para marcar como concluído
    print("\n📝 [STEP 2] POST /users/2/progress/1 with status='completed'")
    result = update_activity_progress(
        db=db,
        user_id=2,
        content_id=1,
        status="completed",
        progress_percentage=100,
        time_spent=0
    )
    print(f"   Resultado do POST: status={result.status}, id={result.id}")
    
    # STEP 3: GET após (mesma sessão)
    print("\n📊 [STEP 3] GET /users/2/progress (APÓS marcar como concluído - mesma sessão)")
    after_same_session = get_user_progress_summary(db, 2)
    print(f"   Resultado: completed={after_same_session['completed_activities']}, total={after_same_session['total_activities']}")
    
    # STEP 4: Nova sessão
    print("\n🔄 [STEP 4] Criando NOVA SESSÃO de banco")
    db.close()
    db = SessionLocal()
    
    print("\n📊 [STEP 5] GET /users/2/progress (NOVA SESSÃO)")
    after_new_session = get_user_progress_summary(db, 2)
    print(f"   Resultado: completed={after_new_session['completed_activities']}, total={after_new_session['total_activities']}")
    
    # VERIFICAÇÃO
    print("\n" + "═" * 50)
    if after_new_session['completed_activities'] > before['completed_activities']:
        print(f"✅ SUCCESS: completed aumentou de {before['completed_activities']} para {after_new_session['completed_activities']}")
    else:
        print(f"❌ FAILURE: completed não aumentou! antes={before['completed_activities']}, depois={after_new_session['completed_activities']}")
    
finally:
    db.close()
