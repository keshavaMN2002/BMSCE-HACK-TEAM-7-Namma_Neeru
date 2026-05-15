from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.official_schema import OfficialResponse
from app.controllers.official_controller import OfficialController
from app.utils.dependencies import get_current_user, require_role

router = APIRouter(
    prefix="/api/officials",
    tags=["officials"]
)

@router.get("/", response_model=List[OfficialResponse])
def read_officials(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return OfficialController.get_officials(db, skip=skip, limit=limit)

@router.get("/me", response_model=OfficialResponse)
def read_current_official(current_user = Depends(require_role(["official"]))):
    return current_user

@router.get("/{official_id}", response_model=OfficialResponse)
def read_official(official_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return OfficialController.get_official(db, official_id=official_id)

@router.delete("/{official_id}")
def delete_official(official_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return OfficialController.delete_official(db, official_id=official_id)
