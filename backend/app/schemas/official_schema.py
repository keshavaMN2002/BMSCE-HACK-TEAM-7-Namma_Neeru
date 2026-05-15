from pydantic import BaseModel
from datetime import datetime


class OfficialBase(BaseModel):
    officialId: str


class OfficialLogin(OfficialBase):
    password: str


class OfficialResponse(OfficialBase):
    id: int
    role: str = "official"
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True