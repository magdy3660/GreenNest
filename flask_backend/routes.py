from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from scanController import ScanController
import os
import logging

predict_bp = Blueprint('predict', __name__)
UPLOAD_FOLDER = 'uploads'

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    try:
        # Log request details
        logger.debug(f"Request Files: {request.files}")
        logger.debug(f"Request Form Data: {request.form}")
        logger.debug(f"Request Content Type: {request.content_type}")
        
        # Validate request content type
        if not request.content_type or 'multipart/form-data' not in request.content_type:
            logger.error(f"Invalid content type: {request.content_type}")
            return jsonify({
                "success": False,
                "message": "Request must be multipart/form-data"
            }), 400
            
        # Get all file keys and log them
        file_keys = list(request.files.keys())
        logger.debug(f"All file keys in request: {file_keys}")
        
        # Try to find the image key, accounting for quoted versions
        image_key = None
        for key in file_keys:
            if key.strip("'") == 'image':
                image_key = key
                break
                
        if not image_key:
            logger.error("No image file in request")
            return jsonify({
                "success": False,
                "message": "No image file provided. Please ensure the file is uploaded with key 'image'"
            }), 400
            
        image = request.files[image_key]
        if not image.filename:
            logger.error("Empty filename received")
            return jsonify({
                "success": False,
                "message": "Empty filename received"
            }), 400
            
        # Save and process image
        try:
            filename = secure_filename(image.filename)
            image_path = os.path.join(UPLOAD_FOLDER, filename)
            logger.debug(f"Saving image to: {image_path}")
            image.save(image_path)
            
            scan_controller = ScanController()
            result = scan_controller.process_image(image_path)
            
            # Clean up uploaded file
            if os.path.exists(image_path):
                os.remove(image_path)
                logger.debug(f"Cleaned up file: {image_path}")
            
            return jsonify(result)
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            if os.path.exists(image_path):
                os.remove(image_path)
            return jsonify({
                "success": False,
                "message": f"Error processing image: {str(e)}"
            }), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400