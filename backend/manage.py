import os
from flask_migrate import Migrate
from dotenv import load_dotenv
from backend.app import create_app
from backend.extensions import db # Import db from extensions.py

# Load environment variables
load_dotenv()

# Create the Flask app instance using your factory function
app = create_app()

# Initialize Flask-Migrate with the app and db instance
migrate = Migrate(app, db)

# This file can also contain other Flask CLI commands if needed
# For now, its primary purpose is to enable 'flask db' commands
