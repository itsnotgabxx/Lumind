"""
Script de migração para adicionar suporte a IA.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings
import json
from datetime import datetime

def upgrade():
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        # Verifica e adiciona colunas na tabela users
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN cognitive_profile TEXT"))
        except:
            pass
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN learning_metrics TEXT"))
        except:
            pass
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN last_profile_update TIMESTAMP"))
        except:
            pass
        
        # Verifica e adiciona colunas na tabela content
        try:
            conn.execute(text("ALTER TABLE content ADD COLUMN difficulty_level INTEGER DEFAULT 1"))
        except:
            pass
        try:
            conn.execute(text("ALTER TABLE content ADD COLUMN learning_style_weights TEXT"))
        except:
            pass
        try:
            conn.execute(text("ALTER TABLE content ADD COLUMN prerequisites TEXT"))
        except:
            pass
        
        # Cria tabela de interações se não existir
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS user_interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                content_id INTEGER,
                interaction_type VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(content_id) REFERENCES content(id)
            )
        """))
        
        # Cria índices se não existirem
        try:
            conn.execute(text("CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id)"))
        except:
            pass
        try:
            conn.execute(text("CREATE INDEX idx_user_interactions_content_id ON user_interactions(content_id)"))
        except:
            pass
        try:
            conn.execute(text("CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type)"))
        except:
            pass
        
        conn.commit()

def downgrade():
    # SQLite não suporta DROP COLUMN, então precisaríamos recriar as tabelas
    # Por segurança, vamos apenas remover a tabela de interações
    engine = create_engine(settings.database_url)
    
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS user_interactions"))
        conn.commit()

if __name__ == "__main__":
    print("Executando migração...")
    upgrade()
    print("Migração concluída!")