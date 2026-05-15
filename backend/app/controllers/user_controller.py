from sqlalchemy.orm import Session
from app.services.user_service import UserService
from fastapi import HTTPException

class UserController:
    @staticmethod
    def get_user(db: Session, user_id: int):
        user = UserService.get_user(db, user_id=user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100):
        return UserService.get_users(db, skip=skip, limit=limit)
        
    @staticmethod
    def delete_user(db: Session, user_id: int):
        user = UserService.delete_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User deleted successfully"}
