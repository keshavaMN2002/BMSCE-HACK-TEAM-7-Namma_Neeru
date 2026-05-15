from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routes import health_routes, user_routes, auth_routes
from app.config.database import engine, Base

# Create database tables
# (In production, use Alembic for migrations instead of doing this)
Base.metadata.create_all(bind=engine)

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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_routes.router)
app.include_router(auth_routes.router)
app.include_router(user_routes.router)

@app.get("/")
@limiter.limit("5/minute")
def root(request: Request):
    return {"message": "Welcome to NammaNeeru API. Go to /docs for API documentation."}