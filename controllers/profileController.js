const DBService = require("../services/DB_service");
const path = require('path');
//PROFILE CONTROLLER, HOLDS profile, favourites, history, dashboard

// PROFILE
exports.getProfile = async (req, res) => {
    const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to profile, Missing userId"
    })}
    
    try {
        const userDetails = {
            firstName:req.user.firstName,
            lastName: req.user.lastName,
            email:req.user.email,
            photo: req.user.photo
        }
            console.log(userDetails)
        if (userDetails){
        res.status(200).json({ 
            success: true,
             data: userDetails
             });
           }
        else {
        res.status(400).json({
            success:true,
            message:"User Not found",
            data:{}
        })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to profile, Missing userId"
    })}

    try {
        const updates = {};
        
        if (req.body.firstName) {
            updates['firstName'] = req.body.firstName;
        }
        if (req.body.lastName) {
            updates['lastName'] = req.body.lastName;
        }

        if (req.file) {
            updates['photoPath'] = req.file.path
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No updates provided"
            });
        }
        console.log(updates)

        const updatedUser = await DBService.updateProfile(userId, updates)
        
        if (updatedUser) {

            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DASHBOARD

exports.getDashboard = async (req, res) => {
    const userId = req.params.userId
    const firstName =  req.user.firstName

    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to dashboard, Missing userId"
    })}
    try {
    // Use the authenticated user's ID from the request object
        console.log('Fetching dashboard data for user:', userId);
        let favouritePlants = []
        let previousScans = []
        let trackedPlants = []
        
        try {
            previousScans = await DBService.getAllScans(userId);
        } catch (err) {
            console.log(err)
        }

        
        try {
            favouritePlants = await DBService.getAllFavs(userId)
        } catch (err) {
            console.log(err)
        }

            try {
            trackedPlants = await DBService.getAllTrackedPlants(userId)
        } catch (err) {
            console.log(err)
        }

        res.status(200).json({
            success: true,
            data:{ 
                firstName:firstName,
                trackedPlants:trackedPlants? trackedPlants : [],
                favouritePlants:favouritePlants? favouritePlants : [],
                previousScans:previousScans? previousScans : [],
                   
                 }
                });
        

    } catch (error) {
    res.status(500).json({
         success: true,
          message: "Backend Error"+ error.message });
    } 

  
  };

   // lib Favs
   exports.saveToFavs = async (req, res) => { 
    const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to favourites, Missing userId"
    })}

    const speciesId = req.params.speciesId
    if (!speciesId) {
        res.status(400).json({
            success:false,
            message:"No speciesId provided"
        })
    }
    // Modify login here to properly send Fail responses
   try {
    const saveOperation = await DBService.saveToFavs(userId, specieId)
    if (saveOperation) {
        res.status(200).json({
            success:true,
            Message:"Favourite saved successfully",
            data:saveOperation
        })
    }
    else {
        res.status(500).json({
            success:false,
            error:{
            message:"SERVER_ERROR"
            }
        })
    }
   }
   catch (err) {
    res.status(500).json({
        success:false,
        message:"Failed to save favourite speice, server is cooked :("
    })
   }
}

exports.getAllFavs = async (req, res) => {
    const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to favourites, Missing userId"
    })}
    
    try {
            const favourites = await DBService.getAllFavs(userId)

            if (favourites) {
                res.status(200).json({
                    success:true,
                    favSpecies:favourites
                })
            }

            else {
                    res.status(200).json({
                        success:true,
                        message:"No favourites present, start by adding species to your favourites",
                        data:[]

                    })
                }
    
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Failed to Retrieve favourite speices, server is cooked :("
        })
     }

    } 


    // get single favourite
    exports.getLibFav = async (req, res) => {

        const specieId = req.params.specieId
        if (!specieId) {
            res.status(400).json({
                succes:false,
                message: "No SpecieId provided"
            })
        } 
         // if found show object if status 400 or message, show error or success false, 
        try {
            const favEntry = await DBService.getFavLibEntry(specieId)

            if (favEntry){
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




  // tracking cont
  exports.getTrackedPlants = async (req,res) => {
    const userId = req.params.userId
    if (userId != req.user.userId) {     
        res.status(403).json({
        success:false,
        message:"UnAuthorized access to profile, Missing userId"
    })}
    
    try {
        const trackedPlants = await DBService.getAllTrackedPlants(userId)
        if (trackedPlants) {
            res.status(200).json({
                success:true,
                data:trackedPlants
            })
        }
        else {
            res.status(200).json({
                success:true,
                message: "No entries found. Please add some entries to get started.",
                data: []
            })
          }
        }
    catch (err)  {
        console.log("SOmething went wrong while retrieving tracked plants")
        return res.status(500).json({
            succes:false,
            message:err
        })
    }
   }

 