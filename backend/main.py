from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from sqlalchemy import text

from routes import health_routes, booking_routes
# Temporarily commented out old routes that rely on deprecated models
# from routes import auth_routes, customer_routes, worker_routes, official_routes
from database import engine, Base, get_db
import models # Ensure all models are loaded

# Create database tables
# (In production, use Alembic for migrations instead of doing this)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error creating database tables: {e}")

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="NammaNeeru API",
    description="Backend API for NammaNeeru - Bengaluru water crisis monitoring platform",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175",
        "http://localhost:3000", "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_routes.router)
app.include_router(booking_routes.router)
# app.include_router(auth_routes.router)
# app.include_router(customer_routes.router)
# app.include_router(worker_routes.router)
# app.include_router(official_routes.router)

@app.get("/")
@limiter.limit("5/minute")
def root(request: Request):
    return {"message": "Welcome to NammaNeeru API. Go to /docs for API documentation."}

@app.get("/db-test")
def test_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}