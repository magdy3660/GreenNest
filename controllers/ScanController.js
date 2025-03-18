const History = require("../models/history");
const DBService = require("../services/DB_service");
const DetectionService = require("../services/detection_service");

exports.sendForDetection = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }
    try {
      const scanResult = await DetectionService.analyzeImageFromPath(req.file.path, req.params.userId);

      // Create image metadata object
      const image_metadata = {
        image_name: req.file.originalname,
        image_path: req.file.path
      };
      // const {message,prediction,success} = scanResult
      return res.status(200).json({
      scanResult,
      image_metadata
      });

    } catch (err) {
      return res.status(503).json({
        success: false,
        message: err.message || "AI service is currently unavailable",
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message
    });
  }
};
exports.saveToHistory = async (req, res) => {
    try {
        const {prediction, image_metadata} = req.body.historyDetail;
         const entry = {
          prediction:prediction,
          image_metadata:{
            image_name:image_metadata.image_name,
            image_path:image_metadata.image_path
          }
         }
        

        const savedEntry = await DBService.saveToHistory(req.params.userId, entry);

        return res.status(201).json({
            success: true,
            message: "Scan results saved to history",
            data: savedEntry
        });

    } catch (error) {
        console.error('Save to history error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to save scan results",
            error: error.message
        });
    }
};
exports.getHistory = async(req,res) => {
  const userId = req.params.userId;
  const cookieUserId = req.userId
  if (userId != cookieUserId) {
    res.status(403).res.json({
      msg: "Forbidden: you're not allowed to update this resource",
      success: false
    })
  }
 
  try {
    // Check if userId is a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }
    const history = await DBService.getHistory(userId);
    
    if (!history || history.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No history found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      message: "History retrieved successfully",
      data: history
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
      error: error.message
    });
  }
};
  
exports.getHistoryEntry = async(req,res) => {
  if (!req.params.userId || !req.params.historyId) {
    return res.status(400).json({
      success: false,
      message: "UserId and HistoryId are required"
    });
  }

  const {userId, historyId} = req.params;

  try {
    // Check if userId and historyId are valid MongoDB ObjectIds
    if (!/^[0-9a-fA-F]{24}$/.test(userId) || !/^[0-9a-fA-F]{24}$/.test(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or history ID format"
      });
    }

    const historyEntry = await DBService.getHistoryEntry(userId, historyId);
    
    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: "History entry not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "History entry retrieved successfully",
      data: historyEntry
    });

  } catch (error) {
    console.error('Error fetching history entry:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history entry",
      error: error.message
    });
  }
};