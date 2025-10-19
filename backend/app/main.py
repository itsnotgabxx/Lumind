from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth_router, content_router, message_router
from app.core.config import settings
from app.db.database import engine
from app.models import user_model, content_model

app = FastAPI(
    title="Lumind API",
    description="API para plataforma educacional Lumind",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # desenvolvimento: permite abrir o front via file:// ou qualquer porta
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar tabelas do banco de dados
user_model.Base.metadata.create_all(bind=engine)
content_model.Base.metadata.create_all(bind=engine)

# Incluir routers
app.include_router(auth_router.router, prefix="/api/users", tags=["users"])
app.include_router(content_router.router, prefix="/api", tags=["content"])
app.include_router(message_router.router, prefix="/api/messages", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "Lumind API está funcionando!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API está operacional"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
