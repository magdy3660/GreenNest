const DBService = require("../services/DB_service");

// from lib

exports.saveToFavs = async (req, res) => {
const speciesId = req.params.specieId
const userId = req.params.userId
if (req.userId != userId) {
    res.status(403).json({
    success:false,
    message:"UnAuthorized access to favourites, Missing userId"
    })
 }
if (!speciesId) {
    res.status(400).json({
        success:false,
        message: "bad reqeuest, missing specieId",
    })
}
try {
    const savedPlant = await DBService.saveToFavs(userId, speciesId)
    
    }catch(err) {
        res.status(500).json({
            success:false,
            message:"Failed to save favourite speice, server is cooked :("
        })
    }
}



