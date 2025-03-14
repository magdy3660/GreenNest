from flask import Flask
from routes import predict_bp
import os

app = Flask(__name__)

# Ensure upload directory exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Register blueprints
app.register_blueprint(predict_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5000)