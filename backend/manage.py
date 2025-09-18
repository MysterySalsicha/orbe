import os
from flask_migrate import Migrate, MigrateCommand
# ... (rest of your code)
app = create_app()
# ... (rest of your code)
migrate = Migrate(app, db)
app.cli.add_command('db', MigrateCommand) # Add this line

# This file can also contain other Flask CLI commands if needed
# For now, its primary purpose is to enable 'flask db' commands
