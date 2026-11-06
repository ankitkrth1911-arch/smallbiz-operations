import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# Resolve backend directory reliably regardless of execution working directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    APP_NAME: str = "SmallBiz AI Operations Room"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    DATABASE_URL: str = "sqlite:///./data/smallbiz.db"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]
    SWITCH_API_KEY: str = ""
    SWITCH_ROOM_ID: str = "smallbiz-ops-room-q4"
    SWITCH_ENDPOINT: str = "https://api.switchagents.ai/v1"

    class Config:
        env_file = str(ENV_FILE) if ENV_FILE.exists() else ".env"
        extra = "ignore"

settings = Settings()
