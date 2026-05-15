from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class CrisisPrediction(Base):
    __tablename__ = "crisis_predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    region_name = Column(String(100), nullable=False, index=True)
    risk_score = Column(Float, nullable=False) # 0.0 to 1.0 or similar
    predicted_shortage_liters = Column(Float, nullable=True)
    
    # Could link to an official who verified it, or an automated system
    verified_by_official_id = Column(Integer, ForeignKey("bwssb_officials.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    official = relationship("BWSSBOfficial", backref="verified_predictions")
