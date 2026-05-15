from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.worker_schema import WorkerResponse
from app.controllers.worker_controller import WorkerController
from app.utils.dependencies import get_current_user, require_role

router = APIRouter(
    prefix="/api/workers",
    tags=["workers"]
)

@router.get("/", response_model=List[WorkerResponse])
def read_workers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return WorkerController.get_workers(db, skip=skip, limit=limit)

@router.get("/me", response_model=WorkerResponse)
def read_current_worker(current_user = Depends(require_role(["worker"]))):
    return current_user

@router.get("/{worker_id}", response_model=WorkerResponse)
def read_worker(worker_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official", "worker"]))):
    return WorkerController.get_worker(db, worker_id=worker_id)

@router.delete("/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return WorkerController.delete_worker(db, worker_id=worker_id)
