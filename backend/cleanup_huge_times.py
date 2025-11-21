"""
Script para limpar registros de atividades com valores absurdos
"""
from app.db.database import SessionLocal
from app.models.content_model import ActivityProgress

db = SessionLocal()

# Encontrar registros com time_spent muito grande (mais de 100 horas = 6000 min)
huge_times = db.query(ActivityProgress).filter(
    ActivityProgress.time_spent > 6000
).all()

print(f"🔍 Encontrados {len(huge_times)} registros com tempo gigantesco:\n")

for record in huge_times:
    print(f"   ID: {record.id}")
    print(f"   User: {record.user_id}, Content: {record.content_id}")
    print(f"   Time: {record.time_spent}min ({record.time_spent // 60}h)")
    print(f"   Status: {record.status}")
    print()

if huge_times:
    confirm = input("Deseja deletar estes registros? (s/n): ")
    if confirm.lower() == 's':
        for record in huge_times:
            db.delete(record)
        db.commit()
        print(f"✅ {len(huge_times)} registros deletados!")
    else:
        print("Cancelado.")
else:
    print("✅ Nenhum registro com valores absurdos encontrado!")

db.close()
