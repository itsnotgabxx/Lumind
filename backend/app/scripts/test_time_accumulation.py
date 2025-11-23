#!/usr/bin/env python3
"""
Teste: Simular o cenário onde usuário com 2h de time_spent 
recebe auto-save de 30 segundos
"""

import sys
sys.path.insert(0, '/Users/Lenovo/Downloads/Lumind/backend')

from app.db.database import SessionLocal, engine
from app.models.user_model import User
from app.models.content_model import Content, ActivityProgress
from app.services.content_service import update_activity_progress
from datetime import datetime

db = SessionLocal()

print("\n" + "="*80)
print("🧪 TESTE: Acumulação de Tempo com Auto-Save")
print("="*80)

# Limpar teste anterior
user = db.query(User).filter(User.email == "test_time@example.com").first()
if user:
    db.query(ActivityProgress).filter(ActivityProgress.user_id == user.id).delete()
    db.delete(user)
    db.commit()

# Criar usuário e conteúdo de teste
print("\n1️⃣ SETUP: Criando usuário e conteúdo...")
user = User(
    email="test_time@example.com",
    password="hash",
    full_name="Teste Time",
)
db.add(user)
db.commit()
db.refresh(user)
print(f"   ✅ Usuário criado: ID={user.id}")

content = Content(
    title="Conteúdo Teste",
    type="text",
    description="Teste",
    content="Teste",
    is_active=True
)
db.add(content)
db.commit()
db.refresh(content)
print(f"   ✅ Conteúdo criado: ID={content.id}")

# Simular: Usuário estuda por 2 horas, depois recebe auto-save de 30s
print("\n2️⃣ PRIMEIRO AUTO-SAVE: Usuário já tem 2 horas (7200 segundos)...")
print("   Frontend: Enviando 30 segundos (tempo desde último auto-save)")
print("   Backend: Recebe 30s → converte para 1min (ceil) → soma com 120min anterior")

result = update_activity_progress(
    db,
    user_id=user.id,
    content_id=content.id,
    status="in_progress",
    progress_percentage=50,
    time_spent=30  # 30 segundos (incremental)
)

print(f"\n   ✅ Resultado:")
print(f"      Status: {result.status}")
print(f"      Tempo final: {result.time_spent} minutos")
print(f"      (Esperado: ~1 minuto - pois é o primeiro auto-save)")

if result.time_spent == 1:
    print(f"      ✅ CORRETO!")
else:
    print(f"      ❌ ERRO! Esperava 1, recebeu {result.time_spent}")

# Simular: Mais um auto-save de 30s
print("\n3️⃣ SEGUNDO AUTO-SAVE: Após mais 30 segundos...")
print("   Frontend: Enviando 30 segundos (tempo desde último auto-save)")
print("   Backend: Recebe 30s → converte para 1min → soma com 1min anterior")

result = update_activity_progress(
    db,
    user_id=user.id,
    content_id=content.id,
    status="in_progress",
    progress_percentage=60,
    time_spent=30  # Mais 30 segundos
)

print(f"\n   ✅ Resultado:")
print(f"      Status: {result.status}")
print(f"      Tempo final: {result.time_spent} minutos")
print(f"      (Esperado: ~2 minutos - acumulado)")

if result.time_spent == 2:
    print(f"      ✅ CORRETO!")
else:
    print(f"      ❌ ERRO! Esperava 2, recebeu {result.time_spent}")

# Simular: Auto-save de 1 minuto
print("\n4️⃣ TERCEIRO AUTO-SAVE: Após mais 1 minuto (60 segundos)...")
print("   Frontend: Enviando 60 segundos")
print("   Backend: Recebe 60s → converte para 1min → soma com 2min anterior")

result = update_activity_progress(
    db,
    user_id=user.id,
    content_id=content.id,
    status="in_progress",
    progress_percentage=70,
    time_spent=60  # 1 minuto
)

print(f"\n   ✅ Resultado:")
print(f"      Status: {result.status}")
print(f"      Tempo final: {result.time_spent} minutos")
print(f"      (Esperado: ~3 minutos)")

if result.time_spent == 3:
    print(f"      ✅ CORRETO!")
else:
    print(f"      ❌ ERRO! Esperava 3, recebeu {result.time_spent}")

print("\n" + "="*80)
print("✅ TESTE CONCLUÍDO!")
print("="*80 + "\n")

# Limpar
db.query(ActivityProgress).filter(ActivityProgress.user_id == user.id).delete()
db.delete(user)
db.delete(content)
db.commit()
