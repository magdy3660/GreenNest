const History = require('../models/history');
const plant_service = require('../services/plant_service');
const storage_service = require('../services/storage_service');
const DetectionService = require('../services/detection_service');
// Step 1: Upload and store image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file uploaded'
            });
        }

        // Store image metadata
        const imageMetadata = {
            user: req.params.userId,
            image_metadata: {
                image_name: req.file.originalname,
                image_path: req.file.path
            }
        };

        try {
            const savedEntry = await plant_service.saveToHistory(imageMetadata);
            res.status(201).json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    plantId: savedEntry._id,
                    image_metadata: savedEntry.image_metadata
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to upload image'
            });
        }
    }catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image'
        });
    }
}


// Step 2: Process uploaded image with AI
exports.scanPlant = async (req, res) => {
    try {
        const { historyId } = req.body;

        if (!historyId) {
            return res.status(400).json({
                success: false,
                message: 'No history ID provided'
            });
        }

        const scanResults = await DetectionService.analyzeImage(historyId, req.userId);
        if (!scanResults) {
            return res.status(500).json({
                success: false,
                message: 'Error processing plant scan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Plant scanned successfully',
            data: scanResults
        });
    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to scan plant: ' + error.message
        });
    }
};