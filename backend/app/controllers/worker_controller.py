from sqlalchemy.orm import Session
from app.services.worker_service import WorkerService
from fastapi import HTTPException

class WorkerController:
    @staticmethod
    def get_worker(db: Session, worker_id: int):
        worker = WorkerService.get_worker(db, worker_id=worker_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        return worker

    @staticmethod
    def get_workers(db: Session, skip: int = 0, limit: int = 100):
        return WorkerService.get_workers(db, skip=skip, limit=limit)
        
    @staticmethod
    def delete_worker(db: Session, worker_id: int):
        worker = WorkerService.delete_worker(db, worker_id)
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        return {"message": "Worker deleted successfully"}
