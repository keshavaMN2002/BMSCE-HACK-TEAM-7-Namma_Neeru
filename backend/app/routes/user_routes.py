from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.user_schema import UserResponse
from app.controllers.user_controller import UserController
from app.utils.dependencies import get_current_user, require_role

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return UserController.get_users(db, skip=skip, limit=limit)

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user = Depends(get_current_user)):
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official", "worker"]))):
    return UserController.get_user(db, user_id=user_id)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return UserController.delete_user(db, user_id=user_id)
