import torch
import torch.nn as nn
import torch.nn.functional as F
import json
import os
# 2. Add near Configuration section:
script_dir = os.path.dirname(os.path.abspath(__file__))
classes_path = os.path.join(script_dir, "classes.json")
with open(classes_path, 'r') as f:
    json_data = json.load(f)
    CLASSES = json_data['all_classes']
    SUPPORTED_TYPES = json_data['supported_types']
    CLEAN_CLASSES = [cls.split('___')[0].replace('_','') for cls in CLASSES]
import os
import logging

# --- Configuration ---
MODEL_PATH = os.path.join(script_dir, "resnet9.pth")
logger = logging.getLogger(__name__)


_model = None
_device = None
_class_names = None # This will be assigned from ALL_CLASSES

# --- Device Setup ---
def get_default_device():
    """Pick GPU if available, else CPU"""
    if torch.cuda.is_available():
        logger.info("CUDA (GPU) is available, using GPU.")
        return torch.device("cuda")
    else:
        logger.info("CUDA (GPU) not available, using CPU.")
        return torch.device("cpu")

def to_device(data, device):
    """Move tensor(s) to chosen device"""
    if isinstance(data, (list, tuple)):
        return [to_device(x, device) for x in data]
    if isinstance(data, torch.Tensor):
        return data.to(device, non_blocking=True)
    return data

# --- Model Definition ---
class ImageClassificationBase(nn.Module):
    def __init__(self):
        super().__init__()

def ConvBlock(in_channels, out_channels, pool=False):
    layers = [nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
             nn.BatchNorm2d(out_channels),
             nn.ReLU(inplace=True)]
    if pool:
        layers.append(nn.MaxPool2d(4))
    return nn.Sequential(*layers)

class ResNet9(ImageClassificationBase):
    def __init__(self, in_channels, num_classes):
        super().__init__()
        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)
        self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))
        self.conv3 = ConvBlock(128, 256, pool=True)
        self.conv4 = ConvBlock(256, 512, pool=True)
        self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))
        self.classifier = nn.Sequential(nn.MaxPool2d(4),
                                       nn.Flatten(),
                                       nn.Linear(512, num_classes))

    def forward(self, xb):
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out

# --- Model Loading Function ---
def load_model():
    """Loads the model using the predefined class list."""
    global _model, _device, _class_names
    if _model is not None:
        logger.info("Model already loaded.")
        return

    logger.info("Loading model...")
    _device = get_default_device()

    # --- Use Predefined Class List ---
    _class_names = CLASSES# Assign directly from the constant list
    num_classes = len(_class_names)
    if num_classes == 0:
         logger.error("The predefined ALL_CLASSES list is empty!")
         raise ValueError("Predefined class list cannot be empty.")
    logger.info(f"Using predefined list of {num_classes} classes.")
    # logger.debug(f"Classes: {_class_names}") # Optional: log all classes if needed

    # --- Load Model Architecture and Weights ---
    if not os.path.exists(MODEL_PATH):
        logger.error(f"Model weights file not found at: {MODEL_PATH}")
        raise FileNotFoundError(f"Model weights file not found at: {MODEL_PATH}")

    try:
        # Initialize model with the correct number of classes from the list
        _model = ResNet9(in_channels=3, num_classes=num_classes)
        _model.load_state_dict(torch.load(MODEL_PATH, map_location=_device))
        _model = to_device(_model, _device)
        _model.eval() # Set model to evaluation mode
        logger.info(f"Model loaded from {MODEL_PATH} and set to evaluation mode on {_device}.")
    except Exception as e:
        # Log potential errors like mismatch between num_classes and model's final layer size
        logger.exception(f"Error loading model state_dict from {MODEL_PATH}. Check if num_classes ({num_classes}) matches the trained model's output layer: {e}")
        raise RuntimeError(f"Failed to load model weights: {e}")

# --- Prediction Function ---
def predict(image_tensor: torch.Tensor) -> dict:
    """
    Performs inference on a preprocessed image tensor. Uses the globally loaded
    model and predefined class names.

    Args:
        image_tensor: A single preprocessed image tensor (C, H, W) or (1, C, H, W).

    Returns:
        A dictionary containing 'disease' and 'confidence' or 'error'.
    """
    if _model is None or _device is None or _class_names is None:
        logger.error("Model is not loaded. Call load_model() first.")
        return {"error": "Model not initialized"}

    if not isinstance(image_tensor, torch.Tensor):
        logger.error("Invalid input: image_tensor must be a PyTorch Tensor.")
        return {"error": "Invalid input type"}

    # Ensure tensor has batch dimension (B, C, H, W) -> (1, C, H, W)
    if image_tensor.ndim == 3:
        image_tensor = image_tensor.unsqueeze(0)
    elif image_tensor.ndim != 4 or image_tensor.shape[0] != 1:
        logger.error(f"Invalid tensor shape: Expected 3 or 4 dims (batch size 1), got {image_tensor.shape}")
        return {"error": f"Invalid tensor shape {image_tensor.shape}"}

    image_tensor = to_device(image_tensor, _device)

    try:
        with torch.no_grad():
            output = _model(image_tensor)
        probabilities = F.softmax(output, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)
        pred_idx = predicted_idx.item()
        pred_conf = confidence.item()

        if 0 <= pred_idx < len(_class_names): # Use the length of the global list
            predicted_class = _class_names[pred_idx]
            logger.info(f"Prediction: {predicted_class}, Confidence: {pred_conf:.4f}")
            return {
                "disease": predicted_class,
                "confidence": pred_conf
            }
        else:
            logger.error(f"Predicted index {pred_idx} out of bounds for class list size {len(_class_names)}.")
            return {"error": "Prediction index out of bounds"}

    except Exception as e:
        logger.exception(f"Error during model inference: {e}")
        return {"error": f"Inference failed: {str(e)}"}

# (Optional example usage block remains the same)
# if __name__ == '__main__':
#     ...