const libraryController = require("../controllers/libraryController");
const auth = require("../middlewares/auth").auth

// TELL FRONTEND TO ADD A CHECK FOR AUTHENTICATION WHEN TRYING TO ADD TO FAVOURITES
const registerLibraryRoutes = (router) => {
    router.get("/api/v1/library/species", libraryController.getSpecies);
    router.get("/api/v1/library/species/:speciesId", libraryController.getSpeciesEntity);

    // Protect individual routes instead of using router.use()
    router.post("/api/v1/library/users/:userId/favourites", auth, libraryController.saveToFavs);
    router.get("/api/v1/library/users/:userId/favourites", auth, libraryController.getFavourites);
    
    router.get("/api/v1/library/users/:userId/favourites/:speciesId", auth, libraryController.getSpeciesEntity);
}

module.exports = registerLibraryRoutes;   