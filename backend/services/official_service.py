from sqlalchemy.orm import Session
from models.official_model import Official
from utils.security import hash_password

class OfficialService:
    @staticmethod
    def get_official(db: Session, officialId: int):
        return db.query(Official).filter(Official.id == officialId).first()

    @staticmethod
    def get_official_by_email(db: Session, email: str):
        return db.query(Official).filter(Official.email == email).first()

    @staticmethod
    def get_official_by_officialId_str(db: Session, officialId: str):
        return db.query(Official).filter(Official.officialId == officialId).first()

    @staticmethod
    def get_officials(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Official).offset(skip).limit(limit).all()
        
    @staticmethod
    def delete_official(db: Session, officialId: int):
        db_official = db.query(Official).filter(Official.id == officialId).first()
        if db_official:
            db.delete(db_official)
            db.commit()
            return db_official
        return None
