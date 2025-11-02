from app.db.database import SessionLocal
from app.models.content_model import Content

db = SessionLocal()

print("\n" + "="*50)
print("🎮 JOGOS NO BANCO DE DADOS")
print("="*50)

jogos = db.query(Content).filter(Content.type == "interactive_game").all()

if len(jogos) == 0:
    print("\n❌ Nenhum jogo encontrado!")
    print("💡 Primeiro adicione jogos no banco\n")
else:
    print(f"\n✅ Total: {len(jogos)} jogos\n")
    for i, jogo in enumerate(jogos, 1):
        print(f"{i}. {jogo.title} (ID: {jogo.id})")

print("="*50 + "\n")

db.close()