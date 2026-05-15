from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from fastapi import Form, UploadFile, File

class WorkerBase(BaseModel):
    user: str
    mobile: str
    aadhaar: str
    vehicle: Optional[str] = None
    dl: Optional[str] = None

class WorkerRegisterForm:
    def __init__(
        self,
        user: str = Form(...),
        mobile: str = Form(...),
        aadhaar: str = Form(...),
        password: str = Form(...),
        vehicle: Optional[str] = Form(None),
        dl: Optional[str] = Form(None),
        dl_image: UploadFile = File(None)
    ):
        self.user = user
        self.mobile = mobile
        self.aadhaar = aadhaar
        self.password = password
        self.vehicle = vehicle
        self.dl = dl
        self.dl_image = dl_image

class WorkerLogin(BaseModel):
    mobile: str
    password: str

class WorkerResponse(WorkerBase):
    id: int
    dl_image: Optional[str] = None
    role: str = "worker"
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
