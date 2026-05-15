from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    customer_name: str
    mobile_number: str
    detailed_address: str
    water_capacity: int
    payment_amount: float

class BookingResponse(BaseModel):
    id: int
    customer_name: str
    mobile_number: str
    detailed_address: str
    water_capacity: int
    payment_amount: float
    payment_status: str
    booking_status: str
    worker_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
