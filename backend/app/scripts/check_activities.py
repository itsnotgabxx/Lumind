"""
Script para verificar o status das atividades no banco de dados
"""
from app.db.database import SessionLocal
from app.models.user_model import User
from app.models.content_model import ActivityProgress

def check_user_activities(user_id: int):
    """Verifica as atividades de um usuário"""
    db = SessionLocal()
    
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"❌ Usuário {user_id} não encontrado")
            return
        
        print(f"\n👤 Usuário: {user.full_name} (ID: {user.id})")
        print(f"📧 Email: {user.email}")
        
        activities = db.query(ActivityProgress).filter(
            ActivityProgress.user_id == user_id
        ).all()
        
        print(f"\n📊 Total de atividades: {len(activities)}")
        
        completed = [a for a in activities if a.status == "completed"]
        in_progress = [a for a in activities if a.status == "in_progress"]
        not_started = [a for a in activities if a.status == "not_started"]
        
        print(f"   ✅ Concluídas: {len(completed)}")
        print(f"   🔄 Em andamento: {len(in_progress)}")
        print(f"   ⭕ Não iniciadas: {len(not_started)}")
        
        total_time = sum([a.time_spent for a in activities])
        print(f"\n⏱️  Tempo total: {total_time}min ({total_time // 60}h {total_time % 60}min)")
        
        if activities:
            print(f"\n📋 Detalhes das atividades:")
            for i, activity in enumerate(activities, 1):
                print(f"\n   {i}. Content ID: {activity.content_id}")
                print(f"      Status: {activity.status}")
                print(f"      Progresso: {activity.progress_percentage}%")
                print(f"      Tempo gasto: {activity.time_spent}min")
                if activity.completed_at:
                    print(f"      Concluído em: {activity.completed_at}")
    
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Uso: python check_activities.py <user_id>")
        print("\nExemplo: python check_activities.py 1")
        sys.exit(1)
    
    user_id = int(sys.argv[1])
    check_user_activities(user_id)
