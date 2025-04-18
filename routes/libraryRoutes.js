const libraryController = require("../controllers/libraryController");
const auth = require("../middlewares/auth");
const profileController = require("../controllers/profileController");
const plantController = require("../controllers/plantController");


// TELL FRONTEND TO ADD A CHECK FOR AUTHENTICATION WHEN TRYING TO ADD TO FAVOURITES
const registerLibraryRoutes = (router) => {
    router.get("/api/v1/library/species", libraryController.getAllPlants);
    router.get("/api/v1/library/species/:specieId", libraryController.getPlant);
   
   
   
 router.use("/api/v1/users", auth);   
        // favourite library species
  router.get("/api/v1/users/:userId/favourites", profileController.getAllFavs); //all
  router.get("/api/v1/users/:userId/favourites/:speciesId", profileController.getLibFav); //single

  router.post("/api/v1/users/:userId/favourites/:speciesId", plantController.saveToFavs);  
}

module.exports = registerLibraryRoutes;   