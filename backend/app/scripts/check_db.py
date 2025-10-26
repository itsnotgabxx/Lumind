"""
Script para verificar a estrutura do banco de dados.
"""
from sqlalchemy import create_engine, inspect
from app.core.config import settings

def check_database_structure():
    print("Verificando estrutura do banco de dados...")
    engine = create_engine(settings.database_url)
    inspector = inspect(engine)
    
    print("\n=== Tabelas existentes ===")
    for table_name in inspector.get_table_names():
        print(f"\nTabela: {table_name}")
        print("Colunas:")
        for column in inspector.get_columns(table_name):
            print(f"  - {column['name']}: {column['type']}")
        
        print("Índices:")
        for index in inspector.get_indexes(table_name):
            print(f"  - {index['name']}: {index['column_names']}")
            
        print("Chaves estrangeiras:")
        for fk in inspector.get_foreign_keys(table_name):
            print(f"  - {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")

if __name__ == "__main__":
    check_database_structure()