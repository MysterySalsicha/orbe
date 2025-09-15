import os
import psycopg2
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("data_sync.db_operations")

DIRECT_URL = os.getenv("DIRECT_URL")

def get_db_connection():
    """Estabelece conexão com o banco de dados Supabase"""
    try:
        conn = psycopg2.connect(DIRECT_URL)
        return conn
    except Exception as e:
        logger.error(f"Erro ao conectar ao banco de dados: {e}")
        return None
