
import os
from flask import Flask, jsonify
import logging

# Import your components
from scan_controller import ScanController
from models.model import load_model
from routes import predict_bp # Import the blueprint

# --- Basic Logging Setup ---
print("Configuring logging......")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Initialize Flask App ---
app = Flask(__name__)

# --- Configuration ---
print("Configuring upload folder......")
UPLOAD_FOLDER = '../uploads' # This MUST match the directory Node.js uses
app.config['UPLOADS_FOLDER'] = os.path.abspath(UPLOAD_FOLDER)
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # Not strictly needed for this endpoint anymore

# Ensure upload folder exists (Flask process needs read access)
if not os.path.isdir(app.config['UPLOADS_FOLDER']):
    logger.warning(f"Uploads directory configured but not found: {app.config['UPLOADS_FOLDER']}. Ensure it exists and Flask has read permissions.")
    # You might not want Flask to create it if Node.js owns it.
else:
     logger.info(f"Using uploads directory: {app.config['UPLOADS_FOLDER']}")


# --- Load AI Model and Initialize Controller (ONCE at Startup) ---
print("Loading AI model and initializing ScanController......")

try:
    scan_controller_instance = ScanController() # Initialize the controller once
    app.config['SCAN_CONTROLLER'] = scan_controller_instance # Store instance in app config
    logger.info("ScanController initialized and added to app config.")
except Exception as e:
     logger.exception("FATAL: Failed to initialize ScanController.")
     app.config['SCAN_CONTROLLER'] = None


# --- Register Blueprints ---
app.register_blueprint(predict_bp, url_prefix='/api')
logger.info("Registered 'predict_api' blueprint with prefix /api.")

# --- Optional: Add a Root/Health Check Endpoint ---
try:
    logger.info("Starting model loading...")
    print("loading AI MODEL................")
    load_model() # Load the model defined in gem.py
    print("LOADED!")

    logger.info("Model loading complete.")
    app.config['MODEL_LOADED'] = True
except Exception as e:
    logger.exception("FATAL: Failed to load AI model on startup.")
    app.config['MODEL_LOADED'] = False

if __name__ == '__main__':
    if not app.config.get('MODEL_LOADED'):
        logger.warning("Starting Flask server, but AI model FAILED to load.")
    if not app.config.get('SCAN_CONTROLLER'):
        logger.warning("Starting Flask server, but ScanController FAILED to initialize.")
    if not os.path.isdir(app.config['UPLOADS_FOLDER']):
        logger.error(f"Uploads directory {app.config['UPLOADS_FOLDER']} not found or accessible. Predictions will likely fail.")
        # Decide if you should exit(1) here.

    app.run(host='0.0.0.0', port=5000, debug=False)