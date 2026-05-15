from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.user_model import User
from app.schemas.user_schema import UserRegister
from app.utils.security import hash_password

class UserService:
    @staticmethod
    def get_user(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_mobile(db: Session, mobile: str):
        return db.query(User).filter(User.mobile == mobile).first()

    @staticmethod
    def get_user_by_official_id(db: Session, official_id: str):
        return db.query(User).filter(User.official_id == official_id).first()

    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()

    @staticmethod
    def create_user(db: Session, user: UserRegister):
        hashed_password = hash_password(user.password)
        db_user = User(
            user=user.user,
            email=user.email,
            mobile=user.mobile,
            aadhaar=user.aadhaar,
            role=user.role,
            vehicle=user.vehicle,
            dl=user.dl,
            hashed_password=hashed_password,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
        
    @staticmethod
    def delete_user(db: Session, user_id: int):
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user:
            db.delete(db_user)
            db.commit()
            return db_user
        return None
