from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth_router, content_router, message_router, report_router  # , ml_router
from app.core.config import settings
from app.db.database import engine
from sqlalchemy import text
from app.models import user_model, content_model
from app.core.firebase_config import initialize_firebase  # 👈 ADICIONAR ESTA LINHA

app = FastAPI(
    title="Lumind API",
    description="API para plataforma educacional Lumind",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 ADICIONAR ESTE EVENTO DE STARTUP
@app.on_event("startup")
async def startup_event():
    initialize_firebase()
    print("🚀 Firebase Admin inicializado!")
    # Garantir coluna avatar_url no banco (migração simples para SQLite)
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(users)"))
            cols = [row[1] for row in result]
            if 'avatar_url' not in cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url TEXT"))
                conn.commit()
                print("🛠️  Coluna 'avatar_url' adicionada à tabela users")
    except Exception as e:
        print(f"⚠️  Não foi possível garantir a coluna avatar_url: {e}")

# Criar tabelas do banco de dados
user_model.Base.metadata.create_all(bind=engine)
content_model.Base.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(auth_router.router, prefix="/api/users", tags=["users"])
app.include_router(content_router.router, prefix="/api", tags=["content"])
app.include_router(message_router.router, prefix="/api/messages", tags=["messages"])
app.include_router(report_router.router, prefix="/api", tags=["reports"])
# app.include_router(ml_router.router, prefix="/api/ml", tags=["machine-learning"])

# Static files (para avatares e outros)
os.makedirs("static/avatars", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "Lumind API está funcionando!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API está operacional"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)