from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: str = Field(..., example="alex@apexlogistics.com")
    password: str = Field(..., min_length=6, example="password123")

class RegisterRequest(BaseModel):
    fullName: str = Field(..., example="Alex Morgan")
    businessName: Optional[str] = Field(None, example="Apex Logistics Global")
    email: str = Field(..., example="alex@apexlogistics.com")
    password: str = Field(..., min_length=6, example="password123")
    confirmPassword: str = Field(..., min_length=6, example="password123")

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., example="alex@apexlogistics.com")

class UserResponse(BaseModel):
    id: str
    email: str
    fullName: str
    businessName: Optional[str] = None
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    success: bool
    accessToken: str
    tokenType: str = "bearer"
    user: UserResponse
    message: str = "Authentication successful"

