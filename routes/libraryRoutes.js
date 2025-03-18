const libraryController = require("../controllers/libraryController");

const registerLibraryRoutes = (router) => {
    router.get("/api/v1/library/species", libraryController.getAllPlants);
    router.get("/api/v1/library/species/:specieId", libraryController.getPlantById);
}

module.exports = registerLibraryRoutes;
