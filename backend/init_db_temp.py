import sys
import os

# Add project root to sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, project_root)

from dotenv import load_dotenv
from backend.app import create_app
from backend.extensions import db

load_dotenv()

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
