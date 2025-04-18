const axios = require('axios');

class DetectionService {
  constructor() {
    this.flaskApiUrl = "http://127.0.0.1:5000/api/predict";
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  async analyzeImageFromPath(imagePath) {
    let retries = 0;


      console.log("______________-----------SEBDING REQW TO FLASK-----------------------____________________")
      try {
      const response = await axios.post(this.flaskApiUrl, { filename: imagePath}, {timeout: 60000,});
      return response.data
      } catch (err) {
          // AXIOS TREATS NON 200 AS Errors, which are caught in catch blocks.

        if (err.status === 400) {
      
        return {status:400,
          err:err.response.data
        }
      }
       else {
        return {
          success: false,
          message: err.response.message
        }
      }

    };
  } 
}

module.exports = new DetectionService();
