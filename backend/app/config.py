import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "http://localhost:54321")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecret")
    ML_MODELS_PATH: str = os.getenv("ML_MODELS_PATH", "models/")
    FAISS_INDEX_PATH: str = os.getenv("FAISS_INDEX_PATH", "models/faiss/index.bin")
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "mlflow_tracking/")

settings = Settings()
