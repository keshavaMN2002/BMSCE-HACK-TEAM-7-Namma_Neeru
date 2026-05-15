from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.schemas.customer_schema import CustomerResponse
from app.controllers.customer_controller import CustomerController
from app.utils.dependencies import get_current_user, require_role

router = APIRouter(
    prefix="/api/customers",
    tags=["customers"]
)

@router.get("/", response_model=List[CustomerResponse])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return CustomerController.get_customers(db, skip=skip, limit=limit)

@router.get("/me", response_model=CustomerResponse)
def read_current_customer(current_user = Depends(require_role(["customer"]))):
    return current_user

@router.get("/{customer_id}", response_model=CustomerResponse)
def read_customer(customer_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return CustomerController.get_customer(db, customer_id=customer_id)

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["official"]))):
    return CustomerController.delete_customer(db, customer_id=customer_id)
