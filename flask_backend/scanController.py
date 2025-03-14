import os
import logging
from PIL import Image
from models.inference_script import predict_image

class ScanController:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
    def process_image(self, image_file):
        self.logger.debug(f"Processing image: {image_file}")
        try:
            # Validate image file exists
            if not os.path.exists(image_file):
                self.logger.error(f"Image file not found: {image_file}")
                raise Exception("Image file not found")
                
            # Validate file is an image
            try:
                img = Image.open(image_file)
                img.verify()
                self.logger.debug(f"Image validated successfully: {image_file}")
            except Exception as e:
                self.logger.error(f"Invalid image file: {str(e)}")
                raise Exception(f"Invalid image file: {str(e)}")
            
            # Process the image using the prediction model
            prediction = predict_image(image_file)
            self.logger.info(f"Image processed successfully with prediction: {prediction}")
            
            return {
                # "success": True,
                # "message": "Image processed successfully",
                "scanResult": prediction
            }
            
        except Exception as e:
            self.logger.error(f"Error processing image: {str(e)}")
            raise Exception(f"Error processing image: {str(e)}")
    def scan():
        exit()
