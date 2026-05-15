from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    user: str
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    role: str = "customer"
    is_active: Optional[bool] = True

class UserRegister(BaseModel):
    user: str
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    aadhaar: Optional[str] = None
    password: str
    role: str = "customer"
    vehicle: Optional[str] = None
    dl: Optional[str] = None

class UserLogin(BaseModel):
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None
    officialId: Optional[str] = None
    password: str

class UserResponse(UserBase):
    id: int
    aadhaar: Optional[str] = None
    vehicle: Optional[str] = None
    dl: Optional[str] = None
    official_id: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
