from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    user: str
    email: Optional[EmailStr] = None
    mobile: str

class CustomerRegister(CustomerBase):
    password: str

class CustomerLogin(BaseModel):
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str

class CustomerResponse(CustomerBase):
    id: int
    role: str = "customer"
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
