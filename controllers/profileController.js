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

 