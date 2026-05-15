from sqlalchemy.orm import Session
from services.official_service import OfficialService
from fastapi import HTTPException

class OfficialController:
    @staticmethod
    def get_official(db: Session, official_id: int):
        official = OfficialService.get_official(db, official_id=official_id)
        if not official:
            raise HTTPException(status_code=404, detail="Official not found")
        return official

    @staticmethod
    def get_officials(db: Session, skip: int = 0, limit: int = 100):
        return OfficialService.get_officials(db, skip=skip, limit=limit)
        
    @staticmethod
    def delete_official(db: Session, official_id: int):
        official = OfficialService.delete_official(db, official_id)
        if not official:
            raise HTTPException(status_code=404, detail="Official not found")
        return {"message": "Official deleted successfully"}
