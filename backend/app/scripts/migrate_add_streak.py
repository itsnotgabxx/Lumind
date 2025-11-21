"""
Script para adicionar campos streak_days e last_activity_date à tabela users
"""
from sqlalchemy import text
from app.db.database import engine

def migrate_add_streak_fields():
    """Adiciona os novos campos se eles não existirem"""
    with engine.connect() as connection:
        # Verificar se o campo streak_days existe
        try:
            # Para SQLite
            connection.execute(text("ALTER TABLE users ADD COLUMN streak_days INTEGER DEFAULT 0"))
            print("✅ Campo 'streak_days' adicionado com sucesso")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("ℹ️  Campo 'streak_days' já existe")
            else:
                print(f"❌ Erro ao adicionar 'streak_days': {e}")
        
        # Verificar se o campo last_activity_date existe
        try:
            connection.execute(text("ALTER TABLE users ADD COLUMN last_activity_date DATETIME"))
            print("✅ Campo 'last_activity_date' adicionado com sucesso")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("ℹ️  Campo 'last_activity_date' já existe")
            else:
                print(f"❌ Erro ao adicionar 'last_activity_date': {e}")
        
        connection.commit()
        print("✅ Migração concluída!")

if __name__ == "__main__":
    migrate_add_streak_fields()
