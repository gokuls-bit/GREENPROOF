import supabase
from app.config import settings

supabase_client = supabase.create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
