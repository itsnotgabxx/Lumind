from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database (env DATABASE_URL in production)
    database_url: str = os.getenv("DATABASE_URL", "postgresql://postgres:admin@localhost:5433/lumind_db")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # App
    app_name: str = "Lumind"
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()

# SQLAlchemy-compatible URL helper
def get_sqlalchemy_database_url() -> str:
    url = settings.database_url
    if url and url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url
