from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth_router
from app.core.config import settings

app = FastAPI(
    title="Lumind API",
    description="API para plataforma educacional Lumind",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["authentication"])

@app.get("/")
async def root():
    return {"message": "Lumind API está funcionando!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API está operacional"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
