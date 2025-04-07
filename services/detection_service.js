const axios = require('axios');
class DetectionService {
  constructor() {
    this.flaskApiUrl = "http://127.0.0.1:5000/api/predict";
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  async analyzeImageFromPath(imagePath) {
    let retries = 0;
    
    try {
      console.log("[DetectionService] Sending request to Flask API:", { url: this.flaskApiUrl, imagePath });
      const response = await axios.post(this.flaskApiUrl, 
        {
          filename: imagePath
        }, 
        {
          timeout: 60000,
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept all responses to handle them properly
          }
        }
      );

      if (response.status == 400) {
        console.log("csup:",response.data.supported_plants)
        console.error("Unsupported leaf:", response.data);
        return {
          success: response.data.success,
          message: response.data.message,
          supported_plants: response.data.supported_plants || []
        };
      }

      if (response.status !== 200 || response.data.status !== 400) {
        return {
          success: response.data.success,
          message: response.message,
          data: response.data
        };
        
      }
      return {
        success: response.data.success,
        message: response.message,
        detected_disease: response.data.scanResult.data.scanResult.disease,

      };


    } catch (error) {
      console.error("[DetectionService] Error during image analysis:", error);
      if (response.data.status ==400)
      return res.status(400).json({
        status: error.status || 400,
        message: error.message || 'Failed to analyze the image',
        supported_plants: error.supported_plants || []
      });
    }
  }
}

module.exports = new DetectionService();
