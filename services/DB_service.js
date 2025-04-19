const Scan = require('../models/scan');
const User = require('../models/user')
const Species = require('../models/species');
const Favourite = require('../models/favourite');
const storageService = require('./storage_service');
const mongoose = require('mongoose')
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

        const {disease, confidence, remediations, imageMetadata} = scanData;

        const data = {
                user: userId,
                disease,
                confidence,
                remediations,
                imageMetadata
            };
            try {
                const scanEntry = new Scan(data);
                return await scanEntry.save();

            } catch (error) {
            throw new Error(`Failed to save scan entry: ${error.message}`);
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

    
    // LIBRARY  ===========================================================================
    async getSpecies(page) {
        const ITEMS_PER_PAGE = 30;
        const DEFAULT_TOTAL_PLANTS = 416557;
        console.log("get species service")
 
        const currentPage = parseInt(page) || 1;
    
        try {
          const species = await Specie.find()
            .skip((currentPage - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    
            const catalog = species.map(specie => ({
              speciesId: specie._id,
              scientific_name: specie.scientific_name,
              image_url: specie.image_url
            }));
          return {
            species:catalog,
            currentPage: currentPage,
            hasNextPage: ITEMS_PER_PAGE * currentPage < DEFAULT_TOTAL_PLANTS,
            hasPreviousPage: currentPage > 1,
            nextPage: currentPage + 1,
            previousPage: currentPage - 1,
            lastPage: Math.ceil(DEFAULT_TOTAL_PLANTS / ITEMS_PER_PAGE), //415667/20
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    //  get specific plant 
       async getSpeciesEntity(id) {
        try {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid species ID format');
          }
          let species = await Species.findById(id);

          if (!species) {
            throw new Error('Species not found');
          } // return the doc as an object
        species = species.toObject();
          return {
            speciesId: species._id,
            ...species,
          };
        } catch (error) {
          console.error('Error fetching species by ID:', error);
          throw error;
        }
    }
    
    
    async saveToFavs (userId, speciesId){ //species = single plant, (SINGULAR OF SPECIES IS SPECIES....ENGLISH LESSON :)
       
            const species = await Species.findOne({_id:speciesId})
            if (!species) {
                    return null;
                }
                const favourite = new Favourite({
                    user: userId,
                    species: speciesId
                })
                const favouriteEntity = await favourite.save();
                if (favouriteEntity){
                    console.log("favourite entity returned")
                    return favouriteEntity;
                }
                return species;
         
        }

        async getAllFavs(userId) {
            const favourites = await Favourite.find({ user: userId })
              .sort({ createdAt: -1 })
              .populate('species', 'scientific_name image_url')
              .lean();
          
            const cleanedFavs = favourites.map(fav => ({
              favouriteId: fav._id,
              species: fav.species, // already plain from lean() + populate
              // add user: fav.user if you want it
            }));
          
            return cleanedFavs;
          }
          

    // get single library favourite
    async getFavouriteEntity (specieId){
        try {
            const favEntity = await Favourite.findOne({ _id: specieId }).populate('species')
            let favouriteObj = favEntity.species.toObject()
        
            return {
                favouriteId: favEntity._id,
                ...favouriteObj
            };
  
        } catch (err) {
            return {
                message:"DBService error",
                errored_at:err}}
        }
    

    

// trac===========================================================================

    
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