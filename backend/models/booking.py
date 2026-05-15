from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from database import Base
import enum

class BookingStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    completed = "completed"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_name = Column(String(100), nullable=False)
    mobile_number = Column(String(15), nullable=False)
    detailed_address = Column(String(255), nullable=False)
    water_capacity = Column(Integer, nullable=False)
    payment_amount = Column(Float, nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.pending, nullable=False)
    worker_id = Column(Integer, nullable=True) # Will link to worker table later
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
