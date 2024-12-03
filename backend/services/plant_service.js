const History = require('../models/history');
const uploadService = require('./upload_service');
const detectionService = require('./detection_service');
class PlantService {

    async scanPlant(file, userId) {
        // 1. Handle file upload
        const uploadedImage = await uploadService.uploadFile(file);
        
        // 2. Process with AI detection
        // const analysis = await detectionService.analyzeImage(uploadedImage.path);
        
        // 3. Create history entry
        const historyData = {
            user: userId,
            image_metadata: {
                image_name: file.originalname,
                image_path: uploadedImage.path
            },
            // AiScanResults: [{
            //     detected_disease: analysis.diagnosis,
            //     confidence: analysis.confidence,
            //     disease_info: analysis.analysis,
            //     remediation_action: analysis.recommendations
            // }]
        };

        return await this.saveToHistory(historyData);
    }



    async getAllPlant(userId) {
        return await History.find({ user: userId }).sort({ lastUpdated: -1 });
    }

    async getPlant(PlantId, userId) {
        return await Plant.findOne({ _id: PlantId, user: userId });
    }

    async saveToHistory(PlantData) {
        const historyEntry = new History(PlantData);
        return await historyEntry.save();
    }

    async deleteScan(historyId, userId) {
        return await History.findOneAndDelete({ _id: historyId, user: userId });
    }
}

module.exports = new PlantService();