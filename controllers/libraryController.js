const DBservice = require('../services/DB_service');

exports.getSpecies = async (req, res) => {
  const page = req.query.page;
  
  if (!page) {
    return res.status(400).json({
        success:false,
        message:"No page provided"
    })
}

  const plants = await DBservice.getSpecies(page)
  
  res.status(200).json({
  // Data
   message: "Retrieved 30 Entries of 416557 for page " + page,
  data: plants.species,
  
    // Pagination info
  pagination: {
    currentPage: plants.currentPage,
    totalPages: plants.lastPage,
    hasNext: plants.hasNextPage,
    hasPrevious: plants.hasPreviousPage,
    nextPage: plants.nextPage,
    previousPage: plants.previousPage,
  },

  });
};

exports.getSpeciesEntity = async (req, res) => {
  const speciesId = req.params.speciesId
  if (!speciesId) {
    return res.status(400).json({
        success:false,
        message:"No speciesId provided"
    })
  }
    try {
        const speciesEntity = await DBservice.getSpeciesEntity(speciesId)

        if (!speciesEntity) {
            console.log('Plant not found for Plant id:', speciesId);
            return res.status(404).json({ 
              message: "species not found",
            error: {
              message:"Plant not found in DB"
            } });
        }
        res.status(200).json({
            success: true,
            data:speciesEntity
        });
    } catch (error) {
        console.error('502 SERVER ERR at plant retrieval', error);
        res.status(404).json({ 
            success:false,
            message: "Error loading species details, species not found",
             error: {
                message: "species not found"
            } });
    }
 }

exports.saveSpeciesEntity = async (req, res) => {
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
  

exports.saveToFavs = async (req, res) => { 
    console.log("save controlelr hit")
    const userId = req.params.userId
    const speciesId = req.body.speciesId

    if (!speciesId) {
        return res.status(400).json({
            success:false,
            message:"No speciesId provided"
        })
    }
    // Modify login here to properly send Fail responses
   try {
    await DBservice.saveToFavs(userId, speciesId)

        res.status(201).json({
            success:true,
            Message:"Favourite saved successfully",
            data:{
                message: "species saved Succesfully"
            }});
       
    } catch (err) {
        res.status(500).json({
            success:false,
            message: err.message,
            error: {
                message: "failed to save species"
            }})
    }
}

exports.getFavourites = async (req, res) => {
    const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to favourites, Missing userId"
    })}
    
    try {
            const favourites = await DBservice.getAllFavs(userId)
            console.log("returened favs", favourites)
            res.status(200).json({
                success:true,
                message:"Favourites retrieved successfully",
                data:favourites
            })
    
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Failed to Retrieve favourite speices, server is cooked :(",
            error: {
                message: err.message
            }
        })
     }

    } 


    // get single favourite
    exports.getFavouriteEntity = async (req, res) => {

        const specieId = req.params.specieId
        if (!specieId) {
            res.status(400).json({
                succes:false,
                message: "No SpecieId provided"
            })
        } 
         // if found show object if status 400 or message, show error or success false, 
        try {
            const favouriteEntity = await DBservice.getFavouriteEntity(specieId)
            console.log(favouriteEntity.favouriteId)

            if (favouriteEntity){
                res.status(200).json({
                succes:true,
                data:favEntry,
                })
            }
            else {
                res.status(200).json({
                succes:true,
                message: "you dont have any saved entries yet... start by saving a specie to favourites!",
                data:{}
                })

            }

        } catch(err) {
            res.status(500).json({
                succes:false,
                message: "Something Went wrong... add more logging",
                })

        }
    }
