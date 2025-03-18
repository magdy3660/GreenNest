const History = require('../models/history');
const User = require('../models/user')
const storageService = require('./storage_service');
class DBService {


    async getAllPlant(userId) {
        return await History.find({ user: userId }).sort({ lastUpdated: -1 });
    }

    async getPlant(PlantId, userId) {
        return await History.findOne({ _id: PlantId, user: userId });
    }
    async getUserDetails(userId) {
        try {
            console.log("Retrieving user account details for user ID: " + userId);
            const userDetails = await User.findById(userId);
            return {
                email: userDetails.email,
                name: userDetails.Name.firstName +" "+ userDetails.Name.lastName,
                photo: userDetails.photo
            }
        } catch (error) {
            throw new Error(`Failed to fetch user details: ${error.message}`);
        }
    }
     async getHistory(userId) {
       
        try {
            console.log(userId)
            return await History.find({ user: userId }).sort({ scan_time: -1 });
        } catch (error) {
            throw new Error(`Failed to fetch history: ${error.message}`);
        }
    }

    async getHistoryEntry(userId, historyId) {
        if (!userId || !historyId) {
            throw new Error('User ID and History ID are required');
        }
        try {
            return await History.findOne({ _id: historyId, user: userId });
        } catch (error) {
            throw new Error(`Failed to fetch history entry: ${error.message}`);
        }
    }
    async saveToHistory(userId, scanData) {
        if (!scanData) {
            throw new Error('Scan details are required');
        }


        if (!scanData?.prediction) {
            throw new Error('Invalid scan result: prediction is required');
        }
        console.log(scanData)
        const {prediction, image_metadata} = scanData;

        if (!image_metadata?.image_name || !image_metadata?.image_path) {
            throw new Error('Invalid image metadata: image name and path are required');


        }
        const Entry = {
            user: userId,
            predicted_disease: prediction,
            image_metadata: {
                image_name: image_metadata.image_name,
                image_path: image_metadata.image_path
            }
        };
        
        try {
            const historyEntry = new History(Entry);
            return await historyEntry.save();
        } catch (error) {
            throw new Error(`Failed to save history entry: ${error.message}`);
        }
    }

    async deleteScan(historyId, userId) {
        const history = await History.findOne({ _id: historyId, user: userId });
    
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