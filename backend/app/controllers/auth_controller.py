from fastapi import HTTPException, status, Response
from sqlalchemy.orm import Session
from app.schemas.customer_schema import CustomerRegister, CustomerLogin, CustomerResponse
from app.schemas.worker_schema import WorkerRegisterForm, WorkerLogin, WorkerResponse
from app.schemas.official_schema import OfficialLogin, OfficialResponse
from app.services.customer_service import CustomerService
from app.services.worker_service import WorkerService
from app.services.official_service import OfficialService
from app.utils.security import verify_password, create_access_token

class AuthController:
    
    @staticmethod
    def _process_login(user, password, response: Response, response_model):
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password"
            )
            
        access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
        
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            max_age=60*24*7*60, # 7 days in seconds
            expires=60*24*7*60,
            samesite="lax",
            secure=False # Set to True in production with HTTPS
        )
        
        return {"message": "Login successful", "user": response_model.model_validate(user)}

    @staticmethod
    def register_customer(user_data: CustomerRegister, db: Session):
        if CustomerService.get_customer_by_mobile(db, mobile=user_data.mobile):
            raise HTTPException(status_code=400, detail="Mobile number already registered")
        if user_data.email and CustomerService.get_customer_by_email(db, email=user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
            
        return CustomerService.create_customer(db=db, customer=user_data)

    @staticmethod
    def login_customer(login_data: CustomerLogin, response: Response, db: Session):
        customer = None
        if login_data.mobile:
            customer = CustomerService.get_customer_by_mobile(db, mobile=login_data.mobile)
        elif login_data.email:
            customer = CustomerService.get_customer_by_email(db, email=login_data.email)
            
        if not customer:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect customer login credentials")
            
        return AuthController._process_login(customer, login_data.password, response, CustomerResponse)

    @staticmethod
    def register_worker(user_data: WorkerRegisterForm, db: Session):
        if WorkerService.get_worker_by_mobile(db, mobile=user_data.mobile):
            raise HTTPException(status_code=400, detail="Mobile number already registered")
        if WorkerService.get_worker_by_aadhaar(db, aadhaar=user_data.aadhaar):
            raise HTTPException(status_code=400, detail="Aadhaar already registered")
            
        dl_image_path = None
        if user_data.dl_image:
            import os
            import uuid
            import shutil
            upload_dir = "uploads/dl_images"
            os.makedirs(upload_dir, exist_ok=True)
            file_ext = user_data.dl_image.filename.split(".")[-1] if user_data.dl_image.filename else "jpg"
            file_name = f"{uuid.uuid4()}.{file_ext}"
            dl_image_path = os.path.join(upload_dir, file_name)
            
            with open(dl_image_path, "wb") as buffer:
                shutil.copyfileobj(user_data.dl_image.file, buffer)
            
        return WorkerService.create_worker(
            db=db,
            user=user_data.user,
            mobile=user_data.mobile,
            aadhaar=user_data.aadhaar,
            password=user_data.password,
            vehicle=user_data.vehicle,
            dl=user_data.dl,
            dl_image=dl_image_path
        )

    @staticmethod
    def login_worker(login_data: WorkerLogin, response: Response, db: Session):
        worker = WorkerService.get_worker_by_mobile(db, mobile=login_data.mobile)
        if not worker:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect worker login credentials")
            
        return AuthController._process_login(worker, login_data.password, response, WorkerResponse)

    @staticmethod
    def login_official(login_data: OfficialLogin, response: Response, db: Session):

        official = OfficialService.get_official_by_officialId_str(
            db,
            officialId=login_data.officialId
        )

        if not official:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect official login credentials"
            )

        # Plain password check (NO HASHING)
        if login_data.password != official.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password"
            )

        access_token = create_access_token(
            data={
                "sub": str(official.id),
                "role": official.role
            }
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": OfficialResponse.model_validate(official)
        }