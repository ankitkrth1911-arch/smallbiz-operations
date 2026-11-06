import hashlib
import secrets
import uuid
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import RegisterRequest

SALT = "smallbiz_ops_salt_2026"

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        salted = f"{SALT}_{password}".encode("utf-8")
        return hashlib.sha256(salted).hexdigest()

    @classmethod
    def verify_password(cls, password: str, hashed: str) -> bool:
        return cls.hash_password(password) == hashed

    @staticmethod
    def generate_token() -> str:
        return f"sbz_{secrets.token_urlsafe(32)}"

    def seed_default_user(self, db: Session):
        """Ensures default admin user exists for immediate login."""
        default_email = "alex@apexlogistics.com"
        existing = db.query(User).filter(User.email == default_email).first()
        if not existing:
            user = User(
                id="usr_admin_apex",
                email=default_email,
                full_name="Alex Morgan",
                business_name="Apex Logistics Global",
                hashed_password=self.hash_password("password123"),
                is_active=True
            )
            db.add(user)
            db.commit()

    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[Tuple[User, str]]:
        user = db.query(User).filter(User.email.ilike(email.strip())).first()
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        token = self.generate_token()
        return user, token

    def register_user(self, db: Session, data: RegisterRequest) -> Tuple[User, str]:
        existing = db.query(User).filter(User.email.ilike(data.email.strip())).first()
        if existing:
            raise ValueError("An account with this email address already exists.")

        user = User(
            id=f"usr_{uuid.uuid4().hex[:10]}",
            email=data.email.strip().lower(),
            full_name=data.fullName.strip(),
            business_name=data.businessName.strip() if data.businessName else None,
            hashed_password=self.hash_password(data.password),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        token = self.generate_token()
        return user, token

auth_service = AuthService()

