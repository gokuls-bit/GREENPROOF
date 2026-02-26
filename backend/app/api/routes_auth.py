from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user_id: str
    email: str
    message: str = "Successfully authenticated"

@router.get("/ping")
def ping():
    return {"status": "ok"}

@router.post("/login")
async def login(request: LoginRequest):
    """
    Authenticate user with email and password
    TODO: Implement actual authentication with Supabase
    """
    # Placeholder authentication - replace with real implementation
    if not request.email or not request.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    # Mock token generation - replace with real token generation
    return LoginResponse(
        token="mock_jwt_token_" + request.email.split("@")[0],
        user_id="user_" + request.email.split("@")[0],
        email=request.email
    )

@router.post("/logout")
async def logout():
    """Logout current user - invalidate token"""
    return {"status": "success", "message": "Logged out successfully"}

@router.get("/user/profile")
async def get_user_profile():
    """
    Get current user profile information
    TODO: Extract user from JWT token
    """
    return {
        "user_id": "user_123",
        "email": "user@example.com",
        "username": "greenuser",
        "balance": 5000.0,
        "credits_owned": 2500,
        "joined_date": "2025-01-15"
    }
