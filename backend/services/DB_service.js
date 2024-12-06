const History = require('../models/history');
const storageService = require('./storage_service');
const detectionService = require('./detection_service');
class DBService {


    async getAllPlant(userId) {
        return await History.find({ user: userId }).sort({ lastUpdated: -1 });
    }

    async getPlant(PlantId, userId) {
        return await History.findOne({ _id: PlantId, user: userId });
    }

    async saveToHistory(PlantData) {
        const historyEntry = new History(PlantData);
        return await historyEntry.save();
    }

    async deleteScan(plantId, userId) {
        const history = await History.findOne({ _id: plantId, user: userId });
    
        if (!history) {
            return null;
        }
    
        // 2. Delete the file using storage service
        if (history.image_metadata && history.image_metadata.image_path) {
            await storageService.deleteFile(history.image_metadata.image_path);
        }
    
        // 3. Delete the database record
        return await History.findOneAndDelete({ _id: plantId, user: userId });
    }
}
module.exports = new DBService();