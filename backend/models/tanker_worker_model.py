from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum

class WorkerStatusEnum(str, enum.Enum):
    available = "available"
    busy = "busy"
    offline = "offline"

class TankerWorker(Base):
    __tablename__ = "tanker_workers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    aadhaar = Column(String(20), unique=True, index=True, nullable=False)
    vehicle_number = Column(String(50), nullable=True)
    driving_license = Column(String(50), nullable=True)
    status = Column(Enum(WorkerStatusEnum), default=WorkerStatusEnum.offline, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="worker_profile")
