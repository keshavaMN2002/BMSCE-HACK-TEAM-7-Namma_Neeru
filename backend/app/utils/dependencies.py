from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.config.database import get_db

from app.utils.security import SECRET_KEY, ALGORITHM

def get_token_from_cookie(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    # Remove Bearer prefix if it exists in cookie for some reason
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
    return token

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = get_token_from_cookie(request)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = None
    if role == "customer":
        from app.services.customer_service import CustomerService
        user = CustomerService.get_customer(db, customer_id=int(user_id))
    elif role == "worker":
        from app.services.worker_service import WorkerService
        user = WorkerService.get_worker(db, worker_id=int(user_id))
    elif role == "official":
        from app.services.official_service import OfficialService
        user = OfficialService.get_official(db, official_id=int(user_id))
        
    if user is None:
        raise credentials_exception
    return user

def require_role(allowed_roles: list[str]):
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
    return role_checker
