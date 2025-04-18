# scan_controller.py
import os
import logging
from PIL import Image, UnidentifiedImageError
import cv2
import numpy as np
import torch
import torchvision.transforms as transforms
from models.model import SUPPORTED_TYPES
from flask import jsonify
logger = logging.getLogger(__name__)

# --- Heuristic Function (moved inside or can be in utils.py) ---
def is_likely_leaf_heuristic(img_pil, min_leaf_color_percentage=15.0):
    """
    Uses color heuristics (percentage of green OR brown) to guess if an image is a leaf.
    Args:
        img_pil (PIL.Image): Input image in PIL format.
        min_leaf_color_percentage (float): Minimum combined percentage of green/brown pixels required.
    Returns:
        bool: True if likely a leaf based on color, False otherwise.
    """
    try:
        if not isinstance(img_pil, Image.Image):
             raise TypeError("Input must be a PIL Image object")

        img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
        if img_cv.shape[0] == 0 or img_cv.shape[1] == 0:
            logger.warning("Heuristic check: Image has zero dimension.")
            return False

        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)

        # Green Range
        lower_green = np.array([30, 40, 40])
        upper_green = np.array([90, 255, 255])
        # Brown Range
        lower_brown = np.array([10, 50, 20])
        upper_brown = np.array([25, 255, 180])

        green_mask = cv2.inRange(hsv, lower_green, upper_green)
        brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)

        total_pixels = img_cv.shape[0] * img_cv.shape[1]
        if total_pixels == 0: return False

        green_pixels = cv2.countNonZero(green_mask)
        brown_pixels = cv2.countNonZero(brown_mask)

        combined_percentage = ((green_pixels + brown_pixels) / total_pixels) * 100

        logger.debug(f"Heuristic check: Combined={combined_percentage:.2f}% (Threshold: {min_leaf_color_percentage}%)")

        return combined_percentage >= min_leaf_color_percentage

    except Exception as e:
        logger.error(f"Error during heuristic check: {e}")
        return False # Assume not a leaf if analysis fails

class ScanController:
    def __init__(self, image_size=(256, 256)):
        self.logger = logging.getLogger(__name__)
        # Define preprocessing transforms (without heuristic here)
        # Add normalization if your model was trained with it
        self.preprocess_transform = transforms.Compose([
            transforms.Resize(image_size),
            transforms.ToTensor(),
        ])
        self.logger.info("ScanController initialized.")

    def process_image(self, image_path: str) -> torch.Tensor | None:
        """
        Loads, validates, filters, and preprocesses an image file.

        Args:
            image_path: Path to the image file.

        Returns:
            A preprocessed image tensor (C, H, W) if successful,
            otherwise None.
        """
        self.logger.debug(f"Processing image: {image_path}")

        # 1. Validate file exists
        if not os.path.exists(image_path):
            self.logger.error(f"Image file not found: {image_path}")
            return None # Or raise FileNotFoundError

        # 2. Load and Validate Image Format
        try:
            img_pil = Image.open(image_path).convert('RGB')
            # img_pil.verify() # verify() can be tricky, opening might be enough
            self.logger.debug(f"Image loaded successfully: {image_path}")
        except UnidentifiedImageError:
            self.logger.error(f"Invalid or unsupported image format: {image_path}")
            return None # Or raise ValueError
        except Exception as e:
            self.logger.error(f"Error opening image {image_path}: {str(e)}")
            return None # Or raise IOError

        
        try:
            if not is_likely_leaf_heuristic(img_pil, min_leaf_color_percentage=15.0):
                self.logger.info(f"Skipping '{os.path.basename(image_path)}': Failed heuristic check. Image does not contain sufficient leaf-like colors.")
                # Format supported types into a readable string
                supported_types_str = ", ".join(SUPPORTED_TYPES)
                return {
                    "success": False,
                    "message": "The image does not appear to be a leaf. Please ensure the image shows a clear view of a leaf with sufficient green or brown coloring.",
                    "supported_plants": SUPPORTED_TYPES
                }
            self.logger.debug(f"Image passed heuristic check: {image_path}")
        except Exception as e:
             self.logger.error(f"Error during heuristic check for {image_path}: {str(e)}")
             return None # Treat heuristic error as failure

        # 4. Preprocess Image (Transforms)
        try:
            print("PreProcessing Image")
            img_tensor = self.preprocess_transform(img_pil)
            self.logger.debug(f"Image preprocessed successfully: {image_path}")
            return img_tensor # Shape (C, H, W)
        except Exception as e:
            self.logger.error(f"Error applying transforms to image {image_path}: {str(e)}")
            return None # Or raise ValueError
            
    def handle_prediction_request(self, filename: str, upload_folder: str):
   
        # --- Validate Input ---
        if not isinstance(filename, str) or not filename:
            self.logger.warning(f"Invalid 'filename' value received: {filename}")
            return {"success": False, "message": "'filename' must be a non-empty string"}, 400
            
        self.logger.info(f"Processing prediction request for: {filename}")
        
        try:
            image_path = os.path.join(upload_folder, filename)

            abs_upload_folder = os.path.abspath(upload_folder)
            abs_image_path = os.path.abspath(image_path)

            if not abs_image_path.startswith(abs_upload_folder):
                self.logger.error(f"Security Alert: Path traversal attempt detected. Filename '{filename}' resolved outside uploads folder to '{abs_image_path}'")
                return {"success": False, "message": "Invalid filename"}, 400

            # **Security Check 2: Check if file exists**
            if not os.path.exists(image_path):
                self.logger.error(f"File not found at the specified path: {image_path}")
                return {"success": False, "message": f"File '{filename}' not found in uploads directory"}, 404

            self.logger.debug(f"Validated image path: {image_path}")

            # --- Process Image ---
            self.logger.debug(f"Processing image file: {image_path}")
            image_tensor = self.process_image(image_path)

            if image_tensor is None:
                # Error/filtering logged by process_image
                self.logger.warning(f"Image processing failed for {filename}. Check logs for details.")
                return {
                    "success": False,
                    "message": "Image processing failed (invalid format, failed heuristic, or other error)"
                }, 400
                
            # Handle the case where process_image returns a dict with error info
            if isinstance(image_tensor, dict) and "success" in image_tensor and not image_tensor["success"]:
                return {
                    "success": False,
                    "message": image_tensor["message"],
                    "supported_plants": image_tensor.get("supported_plants", [])
                }, 400

            # --- Get Prediction using predict_disease ---
            from models.model import predict as predict_disease
            self.logger.debug("Sending preprocessed tensor for prediction.")
            prediction_result = predict_disease(image_tensor)

            # Check if prediction itself resulted in an error
            if "error" in prediction_result:
                self.logger.error(f"Prediction failed for {filename}: {prediction_result['error']}")
                return {
                    "success": False,
                    "message": f"Prediction failed: {prediction_result['error']}"
                }, 500

            # --- Return Successful Result ---
            self.logger.info(f"Prediction successful for {filename}: {prediction_result}")
            return {
                "success": True,
                "scanResult": prediction_result
            }, 200

        except Exception as e:
            # Catch unexpected errors during path handling, processing, etc.
            self.logger.exception(f"An unexpected error occurred processing filename {filename}: {e}")
            return {"success": False, "message": "An internal server error occurred"}, 500

    # Removed scan() method as it just called exit()