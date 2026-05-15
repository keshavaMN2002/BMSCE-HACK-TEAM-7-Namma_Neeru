from sqlalchemy.orm import Session
from models.worker_model import Worker
from utils.security import hash_password

class WorkerService:
    @staticmethod
    def get_worker(db: Session, worker_id: int):
        return db.query(Worker).filter(Worker.id == worker_id).first()

    @staticmethod
    def get_worker_by_mobile(db: Session, mobile: str):
        return db.query(Worker).filter(Worker.mobile == mobile).first()

    @staticmethod
    def get_worker_by_aadhaar(db: Session, aadhaar: str):
        return db.query(Worker).filter(Worker.aadhaar == aadhaar).first()

    @staticmethod
    def get_workers(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Worker).offset(skip).limit(limit).all()

    @staticmethod
    def create_worker(db: Session, user: str, mobile: str, aadhaar: str, password: str, vehicle: str = None, dl: str = None, dl_image: str = None):
        hashed_password = hash_password(password)
        db_worker = Worker(
            user=user,
            mobile=mobile,
            aadhaar=aadhaar,
            vehicle=vehicle,
            dl=dl,
            dl_image=dl_image,
            hashed_password=hashed_password,
        )
        db.add(db_worker)
        db.commit()
        db.refresh(db_worker)
        return db_worker
        
    @staticmethod
    def delete_worker(db: Session, worker_id: int):
        db_worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if db_worker:
            db.delete(db_worker)
            db.commit()
            return db_worker
        return None
