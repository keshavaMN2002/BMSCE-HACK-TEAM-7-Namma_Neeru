import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

# Load environment variables from .env file
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "nammaneeru_db")

# URL encode the password to handle special characters like @
encoded_password = quote_plus(DB_PASSWORD.strip('"\''))

# Construct DATABASE_URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    # Initialize SQLAlchemy engine
    engine = create_engine(DATABASE_URL)
    
    # Create SessionLocal class
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create Base class for declarative models
    Base = declarative_base()

except Exception as e:
    print(f"Error connecting to the database: {e}")
    # In a production app, you'd log this properly
    raise e

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
