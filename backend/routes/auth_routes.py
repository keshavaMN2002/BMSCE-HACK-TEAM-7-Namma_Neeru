from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from database import get_db
from schemas.customer_schema import CustomerRegister, CustomerLogin, CustomerResponse
from schemas.worker_schema import WorkerRegisterForm, WorkerLogin, WorkerResponse
from schemas.official_schema import OfficialLogin, OfficialResponse
from controllers.auth_controller import AuthController

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

# --- Customer Routes ---

@router.post("/customer/register", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def register_customer(user: CustomerRegister, db: Session = Depends(get_db)):
    return AuthController.register_customer(user, db)

@router.post("/customer/login")
def login_customer(login_data: CustomerLogin, response: Response, db: Session = Depends(get_db)):
    return AuthController.login_customer(login_data, response, db)

# --- Worker Routes ---

@router.post("/worker/register", response_model=WorkerResponse, status_code=status.HTTP_201_CREATED)
def register_worker(user: WorkerRegisterForm = Depends(), db: Session = Depends(get_db)):
    return AuthController.register_worker(user, db)

@router.post("/worker/login")
def login_worker(login_data: WorkerLogin, response: Response, db: Session = Depends(get_db)):
    return AuthController.login_worker(login_data, response, db)

# --- Official Routes ---

@router.post("/official/login")
def login_official(login_data: OfficialLogin, response: Response, db: Session = Depends(get_db)):
    return AuthController.login_official(login_data, response, db)

# --- Common Routes ---

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}
