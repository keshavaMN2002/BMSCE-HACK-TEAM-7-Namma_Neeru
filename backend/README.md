# NammaNeeru Backend

This is the FastAPI backend boilerplate for the NammaNeeru platform.

## Setup Instructions

1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup your MySQL database and update the `.env` file with your credentials.

4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Architecture
This project uses an MVC-inspired architecture:
- `models/`: SQLAlchemy ORM models (Database tables)
- `schemas/`: Pydantic models (Data validation & serialization)
- `services/`: Database interaction logic
- `controllers/`: Business logic
- `routes/`: FastAPI API endpoints
