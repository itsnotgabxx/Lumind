from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth_router, content_router, message_router, report_router, ml_router
from app.core.config import settings
from app.db.database import engine
from sqlalchemy import text
from app.models import user_model, content_model
from app.core.firebase_config import initialize_firebase

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

@app.on_event("startup")
async def startup_event():
    initialize_firebase()
    print("🚀 Firebase Admin inicializado!")
    print("✅ Usando PostgreSQL com Alembic para migrations")
    print("🤖 Motor de IA/ML ATIVADO - Sistema de recomendações e análise cognitiva operacional!")

# Incluir routers
app.include_router(auth_router.router, prefix="/api/users", tags=["users"])
app.include_router(content_router.router, prefix="/api", tags=["content"])
app.include_router(message_router.router, prefix="/api/messages", tags=["messages"])
app.include_router(report_router.router, prefix="/api", tags=["reports"])
app.include_router(ml_router.router, prefix="/api/ml", tags=["machine-learning"])

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