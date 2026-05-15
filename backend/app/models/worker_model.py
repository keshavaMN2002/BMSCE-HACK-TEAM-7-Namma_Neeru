from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.config.database import Base

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String(100), nullable=False)
    mobile = Column(String(15), unique=True, index=True, nullable=False)
    aadhaar = Column(String(20), unique=True, index=True, nullable=False)
    vehicle = Column(String(50), nullable=True)
    dl = Column(String(50), nullable=True)
    dl_image = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="worker", nullable=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
