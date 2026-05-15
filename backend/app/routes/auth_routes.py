from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.user_schema import UserRegister, UserLogin, UserResponse
from app.services.user_service import UserService
from app.utils.security import verify_password, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    if user.mobile and UserService.get_user_by_mobile(db, mobile=user.mobile):
        raise HTTPException(status_code=400, detail="Mobile number already registered")
    if user.email and UserService.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create the user
    return UserService.create_user(db=db, user=user)

@router.post("/login")
def login(login_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = None
    
    # Authenticate based on provided credentials
    if login_data.mobile:
        user = UserService.get_user_by_mobile(db, mobile=login_data.mobile)
    elif login_data.email:
        user = UserService.get_user_by_email(db, email=login_data.email)
    elif login_data.officialId:
        user = UserService.get_user_by_official_id(db, official_id=login_data.officialId)
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login credentials"
        )
        
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
        
    # Generate JWT token
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    
    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=60*24*7*60, # 7 days in seconds
        expires=60*24*7*60,
        samesite="lax",
        secure=False # Set to True in production with HTTPS
    )
    
    return {"message": "Login successful", "user": UserResponse.model_validate(user)}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}
