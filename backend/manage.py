import os
import sys
from flask_migrate import Migrate
from dotenv import load_dotenv

# Add the parent directory of 'backend' to the Python path
# This allows 'backend.app' and 'backend.extensions' to be imported correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app # Now import as part of the backend package
from backend.extensions import db # Now import as part of the backend package

# Load environment variables
load_dotenv()

# Create the Flask app instance using your factory function
app = create_app()

# Initialize Flask-Migrate with the app and db instance
migrate = Migrate(app, db)

# This file can also contain other Flask CLI commands if needed
# For now, its primary purpose is to enable 'flask db' commands
