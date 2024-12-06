const router = require("express").Router();
const libraryController = require("../controllers/libraryController");

router.get("/api/v1/library/species", libraryController.getAllPlants);

module.exports = router;
