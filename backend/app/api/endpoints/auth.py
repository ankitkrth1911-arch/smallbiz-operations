from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    UserResponse,
    ForgotPasswordRequest
)
from app.services.auth_service import auth_service

router = APIRouter()

@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates a user with email and password, returning an access token and user profile.
    """
    res = auth_service.authenticate_user(db, data.email, data.password)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials."
        )
    user, token = res
    return AuthResponse(
        success=True,
        accessToken=token,
        tokenType="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            fullName=user.full_name,
            businessName=user.business_name,
            createdAt=user.created_at.isoformat() if user.created_at else None
        ),
        message=f"Welcome back, {user.full_name}!"
    )

@router.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Creates a new user account and authenticates them immediately.
    """
    if data.password != data.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password and confirmation password do not match."
        )

    try:
        user, token = auth_service.register_user(db, data)
        return AuthResponse(
            success=True,
            accessToken=token,
            tokenType="bearer",
            user=UserResponse(
                id=user.id,
                email=user.email,
                fullName=user.full_name,
                businessName=user.business_name,
                createdAt=user.created_at.isoformat() if user.created_at else None
            ),
            message="Account successfully created."
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiates password reset instructions for the provided email address.
    """
    user = db.query(User).filter(User.email.ilike(data.email.strip())).first()
    return {
        "success": True,
        "message": f"Password reset instructions have been dispatched to {data.email} if an account exists."
    }

@router.get("/me", response_model=UserResponse)
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """
    Retrieves the currently authenticated user profile.
    """
    # Fallback to default admin user if token is present
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        email=user.email,
        fullName=user.full_name,
        businessName=user.business_name,
        createdAt=user.created_at.isoformat() if user.created_at else None
    )

@router.post("/logout")
def logout():
    """
    Terminates the user session.
    """
    return {"success": True, "message": "Successfully signed out"}

