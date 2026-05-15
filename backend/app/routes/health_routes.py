from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["health"]
)

@router.get("/")
def health_check():
    """
    Health check endpoint to verify that the API is up and running.
    """
    return {"status": "ok", "message": "NammaNeeru API is healthy"}
