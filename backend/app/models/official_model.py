from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.config.database import Base


class Official(Base):
    __tablename__ = "officials"

    id = Column(Integer, primary_key=True, index=True)

    officialId = Column(String(20), unique=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)

    role = Column(String(20), default="official")

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)