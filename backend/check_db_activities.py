"""
Script para verificar atividades no banco de dados
"""
from app.db.database import SessionLocal
from app.models.content_model import ActivityProgress, Content
from app.models.user_model import User

db = SessionLocal()

# Pega todos os usuários
users = db.query(User).all()
print(f'👤 Total de usuários: {len(users)}\n')

for user in users[-3:]:  # Últimos 3 usuários
    print('='*60)
    print(f'Usuário: {user.full_name} (ID: {user.id})')
    print(f'Email: {user.email}')
    
    activities = db.query(ActivityProgress).filter(
        ActivityProgress.user_id == user.id
    ).all()
    
    print(f'\n📊 Total de atividades: {len(activities)}')
    
    for act in activities:
        content = db.query(Content).filter(Content.id == act.content_id).first()
        content_title = content.title if content else 'DELETADO'
        content_type = content.type if content else '?'
        
        print(f'\n   Content ID: {act.content_id}')
        print(f'   Título: {content_title}')
        print(f'   Tipo: {content_type}')
        print(f'   Status: {act.status}')
        print(f'   Progresso: {act.progress_percentage}%')
        print(f'   Tempo: {act.time_spent}min')

db.close()
