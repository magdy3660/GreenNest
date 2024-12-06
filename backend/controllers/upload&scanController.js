const History = require("../models/history");
const DBService = require("../services/DB_service");
const storage_service = require("../services/storage_service");
const DetectionService = require("../services/detection_service");

// Step 1: Upload image to temporary storage
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // Store image metadata
    const imageMetadata = {
      user: req.params.userId,
      image_metadata: {
        image_name: req.file.originalname,
        image_path: req.file.path,
      },
    };

    const savedEntry = await DBService.saveToHistory(imageMetadata);

    res.status(201).json({
      success: true,
      message: "Image uploaded and saved successfully",
      data: {
        plantId: savedEntry._id,
        image_metadata: savedEntry.image_metadata,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
};

// Future implementation: Confirm and analyze in one go
exports.confirmAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // 1. Analyze with AI first
    const AIresults = await DetectionService.analyzeImageFromPath(req.file.path);
    if (!AIresults) {
      return res.status(500).json({
        success: false,
        message: "Error analyzing image",
      });
    }

    // 2. If analysis successful, save everything to DB
    const imageMetadata = {
      user: req.params.userId,
      image_metadata: {
        image_name: req.file.originalname,
        image_path: req.file.path,
      },
      AiScanResults: AIresults,
    };

    const savedEntry = await DBService.saveToHistory(imageMetadata);

    res.status(200).json({
      success: true,
      message: "Image analyzed and saved successfully",
      data: {
        plantId: savedEntry._id,
        image_metadata: savedEntry.image_metadata,
        aiResults: savedEntry.AiScanResults,
      },
    });
  } catch (error) {
    console.error("Confirmation and analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze and save image",
    });
  }
};
