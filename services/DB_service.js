const Scan = require('../models/scan');
const User = require('../models/user')
const storageService = require('./storage_service');

class DBService { // Db service holds functions for DB operations get/POST for users, scans, library, history, favourites



    // Users ===========================================================================
    async updateProfile(userId, updates){
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true, runValidators: true }
            );
            return updatedUser;
        } catch (error) {
            throw new Error(`Failed to update user profile: ${error.message}`);
        }
    }

    async getUserDetails(userId) {
        console.log("Retrieving user account details for user ID: " + userId);
        try {    
            const userDetails = await User.findById(userId);
            
                return {
                    email: userDetails.email,
                    firstName: userDetails.Name.firstName,
                    lastName:  userDetails.Name.lastName,
                    photoPath: userDetails.photo
                }
            } catch (error) {
            throw new Error(`Failed to fetch user details: ${error.message}`);
        }
    }
    // Scans ===========================================================================

    
     async getAllScans(userId) {
       let updatedScans = [];
        try {
            const scans = await Scan.find({ user: userId }).sort({ scan_time: -1 });
            if (scans){
                scans.forEach(scan => {

                scan = {
                    historyId: scan._id,
                    disease: scan.disease,
                    confidence: scan.confidence,
                    imageMetadata: scan.imageMetadata,
                    remediations: scan.remediations
                }
                
                updatedScans.push(scan);
            });

            return updatedScans;
          }
        } catch (error) {
            throw new Error(`Failed to fetch scan: ${error.message}`);
        }
    }


    async getScanEntity(userId, scanId) {

        try {
            const scanEntity =  await Scan.findOne({ _id: scanId, user: userId }).sort({ createdAt: -1 })

            if (scanEntity) {
                const mappedScan = {
                    historyId: scanEntity._id,
                    disease: scanEntity.disease,
                    confidence: scanEntity.confidence,
                    imageMetadata: scanEntity.imageMetadata,
                    remediations: scanEntity.remediations
                }

                return mappedScan;
            }

            return null;

        } catch (error) {
            throw new Error(`Failed to fetch scan entry: ${error.message}`);
        }
    }

    // HISTORY aka SCANS ===========================================================================
    async saveScanEntry(userId,scanData) {
        console.log("saving to DB")

        const {disease,confidence,remediations, imageMetadata} = scanData;

         const data = {
            user: userId,
            disease,
            confidence,
            remediations,
            imageMetadata
        };
        if (data) {
            try {
                const scanEntry = new Scan(data);
                return await scanEntry.save();

            } catch (error) {
            throw new Error(`Failed to save scan entry: ${error.message}`);
            }
       }
    }
    

    async deleteScan(scanId, userId) {
        const scan = await scan.findOne({ _id: scanId, user: userId });
    
        if (!scan) {
            return null;
        }
    
        // 2. Delete the file using storage service
        if (scan.image_metadata && scan.image_metadata.image_path) {
            await storageService.deleteFile(scan.image_metadata.image_path);
        }
    
        // 3. Delete the database record
        return await scan.findOneAndDelete({ _id: plantId, user: userId });
    }

    
    // LIBRARY===========================================================================

    async getAllFavs (userId){ // retrieves all library favourite species for a user

        try {
            console.log("getting favs",favs)

        const favs = await Favourites.find({user:userId}).sort({ lastUpdated: -1 });
            return favs

        } catch (err) { 
            return {
                message:"DBService error",
                errored_at:err}}
    }

    // get single library favourite
    async getLibFavEntry (specieId){
        try {
            const favEntry = await Favourites.findOne(specieId)

            if (favEntry){
                return {favEntry}
            }

        } catch (err) {
            return {
                message:"DBService error",
                errored_at:err}}
        }

        async saveToFavs (userId,specieId){
            try {
                const favEntry = await Favourites.findOne({user:userId,species:specieId})
                return {favEntry}
            } catch (err) {
                return {
                    message:"DBService error",
                    errored_at:err}}
            }

// LIBRARY===========================================================================

    
   async getTrackedPLantEntity(trackedPlantId, userId){
        try {
            const trackedPlant = await TrackedPLants.findOne({ _id: trackedPlantId, user: userId });
            return trackedPlant;
        } catch (err) {
            return {
                message: "DBService error",
                errored_at: err
            };
        }
    }
   async getAllTrackedPlants(userId){
    try {
        const trackedPlants = await TrackedPLants.find({user:userId}).sort({ lastUpdated: -1 });
        return trackedPlants;
        } catch (err) { 
            return {
                message:"DBService error",
                errored_at:err}}
    }
}


module.exports = new DBService();