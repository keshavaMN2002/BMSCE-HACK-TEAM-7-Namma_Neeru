from sqlalchemy.orm import Session
from models.customer_model import Customer
from schemas.customer_schema import CustomerRegister
from utils.security import hash_password

class CustomerService:
    @staticmethod
    def get_customer(db: Session, customer_id: int):
        return db.query(Customer).filter(Customer.id == customer_id).first()

    @staticmethod
    def get_customer_by_email(db: Session, email: str):
        return db.query(Customer).filter(Customer.email == email).first()

    @staticmethod
    def get_customer_by_mobile(db: Session, mobile: str):
        return db.query(Customer).filter(Customer.mobile == mobile).first()

    @staticmethod
    def get_customers(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Customer).offset(skip).limit(limit).all()

    @staticmethod
    def create_customer(db: Session, customer: CustomerRegister):
        hashed_password = hash_password(customer.password)
        db_customer = Customer(
            user=customer.user,
            email=customer.email,
            mobile=customer.mobile,
            hashed_password=hashed_password,
        )
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        return db_customer
        
    @staticmethod
    def delete_customer(db: Session, customer_id: int):
        db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if db_customer:
            db.delete(db_customer)
            db.commit()
            return db_customer
        return None
