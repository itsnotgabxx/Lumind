#!/usr/bin/env python3
"""
Migração para adicionar campos user_type e student_id na tabela users
"""

import sqlite3
import os

def migrate_database():
    """Adiciona os novos campos à tabela users"""
    
    db_path = "lumind.db"
    if not os.path.exists(db_path):
        print(f"❌ Arquivo de banco não encontrado: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Verifica se os campos já existem
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        migrations_needed = []
        
        if 'user_type' not in columns:
            migrations_needed.append("ADD COLUMN user_type VARCHAR(20) DEFAULT 'student'")
        
        if 'student_id' not in columns:
            migrations_needed.append("ADD COLUMN student_id INTEGER")
        
        if not migrations_needed:
            print("✅ Campos já existem, mas vamos mostrar a situação atual...")
            # Continua para mostrar o estado atual
        else:
            # Executa as migrações
            for migration in migrations_needed:
                query = f"ALTER TABLE users {migration}"
                print(f"🔄 Executando: {query}")
                cursor.execute(query)
            
            # Atualiza todos os usuários existentes para serem do tipo "student"
            cursor.execute("UPDATE users SET user_type = 'student' WHERE user_type IS NULL")
            updated_rows = cursor.rowcount
            
            conn.commit()
            
            print(f"✅ Migração concluída com sucesso!")
            print(f"   - {len(migrations_needed)} campo(s) adicionado(s)")
            print(f"   - {updated_rows} usuário(s) atualizado(s) como 'student'")
        
        # Mostra o estado atual
        cursor.execute("SELECT id, full_name, email, user_type FROM users")
        users = cursor.fetchall()
        
        print(f"\n📊 Estado atual dos usuários:")
        for user_id, name, email, user_type in users:
            print(f"   - ID {user_id}: {name} ({email}) -> Tipo: {user_type}")
        
        # Mostra estrutura da tabela
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        print(f"\n🏗️ Estrutura da tabela users:")
        for column in columns:
            print(f"   - {column[1]} ({column[2]}) - Default: {column[4]}")
            
    except Exception as e:
        print(f"❌ Erro na migração: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()