from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    mobile = Column(String(15), unique=True, index=True, nullable=True)
    aadhaar = Column(String(20), unique=True, index=True, nullable=True)
    role = Column(String(20), default="customer", nullable=False)
    vehicle = Column(String(50), nullable=True)
    dl = Column(String(50), nullable=True)
    official_id = Column(String(50), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
