import json
import os
from pathlib import Path
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

# Resolve backend directory reliably regardless of execution working directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://smallbiz-operations.vercel.app",
]

class Settings(BaseSettings):
    APP_NAME: str = "SmallBiz AI Operations Room"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    DATABASE_URL: str = "sqlite:///./data/smallbiz.db"
    ALLOWED_ORIGINS: Union[List[str], str] = DEFAULT_ALLOWED_ORIGINS
    SWITCH_API_KEY: str = ""
    SWITCH_ROOM_ID: str = "smallbiz-ops-room-q4"
    SWITCH_ENDPOINT: str = "https://api.switchagents.ai/v1"

    @field_validator("ALLOWED_ORIGINS", mode="after")
    @classmethod
    def assemble_allowed_origins(cls, v) -> List[str]:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return DEFAULT_ALLOWED_ORIGINS
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    cleaned = [str(o).strip().rstrip("/") for o in parsed if str(o).strip()]
                    return cleaned if cleaned else DEFAULT_ALLOWED_ORIGINS
                except Exception:
                    pass
            origins = [o.strip().rstrip("/") for o in v.split(",") if o.strip()]
            return origins if origins else DEFAULT_ALLOWED_ORIGINS
        elif isinstance(v, list):
            cleaned = [str(o).strip().rstrip("/") for o in v if str(o).strip()]
            return cleaned if cleaned else DEFAULT_ALLOWED_ORIGINS
        return DEFAULT_ALLOWED_ORIGINS

    class Config:
        env_file = str(ENV_FILE) if ENV_FILE.exists() else ".env"
        extra = "ignore"

settings = Settings()
