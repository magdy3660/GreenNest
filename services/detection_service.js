const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class DetectionService {
  constructor() {
    this.flaskApiUrl = "http://127.0.0.1:5000/predict";
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  async analyzeImageFromPath(imagePath) {
    let retries = 0;
    
    while (retries < this.maxRetries) {
      try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        
        const response = await axios.post(this.flaskApiUrl, formData, {
          headers: {
            ...formData.getHeaders()
          },
          timeout: 60000
        });
        // Return API RESPONSE
        return response.data.scanResult
  

      } catch (error) {
        retries++;
        
        if (error.code === 'ECONNREFUSED') {
          if (retries === this.maxRetries) {
            throw new Error('Flask API is not available. Please ensure the AI service is running.');
          }
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          continue;
        }

        if (error.code === 'ETIMEDOUT') {
          throw new Error('Flask API request timed out. Please try again later.');
        }

        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

    
 
}

module.exports = new DetectionService();
