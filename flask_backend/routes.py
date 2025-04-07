# predict_routes.py
from flask import Blueprint, request, jsonify, current_app
import os
import logging
from models.model import predict as predict_disease
from scan_controller import ScanController

predict_bp = Blueprint('predict_api', __name__)
logger = logging.getLogger(__name__)

# Move the initialization inside the request handler
@predict_bp.route('/predict', methods=['POST'])
def handle_predict_request():
    """
    Receives a filename via JSON, processes the corresponding image
    from the shared uploads folder, and returns the prediction.
    """
    logger.info("Received request for /predict endpoint.")
    
    # Initialize scan controller within request context
    upload_folder = current_app.config['UPLOADS_FOLDER']
    scan_controller = ScanController()

    if not request.is_json:
        logger.warning("Request received is not JSON.")
        return jsonify({"success": False, "message": "Request body must be JSON"}), 400

    data = request.get_json()
    if not data or 'filename' not in data:
        logger.warning("Missing 'filename' key in JSON payload.")
        return jsonify({"success": False, "message": "Missing 'filename' in request body"}), 400
    
    unique_filename = data['filename']
    # Delegate the prediction handling to the ScanController
    response, status_code = scan_controller.handle_prediction_request(unique_filename, upload_folder)
    
    # Return the response from the controller
    return jsonify(response), status_code