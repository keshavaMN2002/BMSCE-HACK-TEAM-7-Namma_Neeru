from sqlalchemy.orm import Session
from services.customer_service import CustomerService
from fastapi import HTTPException

class CustomerController:
    @staticmethod
    def get_customer(db: Session, customer_id: int):
        customer = CustomerService.get_customer(db, customer_id=customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer

    @staticmethod
    def get_customers(db: Session, skip: int = 0, limit: int = 100):
        return CustomerService.get_customers(db, skip=skip, limit=limit)
        
    @staticmethod
    def delete_customer(db: Session, customer_id: int):
        customer = CustomerService.delete_customer(db, customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return {"message": "Customer deleted successfully"}
