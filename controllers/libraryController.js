const LibraryService = require("../services/library_service");
const DBservice = require('../services/DB_service');

exports.getAllPlants = async (req, res) => {
  const page = req.query.page;
  
  if (!req.params.speciesId) {
    res.status(400).json({
        success:false,
        message:"No specieId provided"
    })
}

  const plants = await LibraryService.getSpecies(req.query.page)
  
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

exports.getPlant = async (req, res) => {
  if (req.params.plantId) {
    try {
        const plant = await DB_service.getPlant(req.params.plantId, req.user._id)


        if (!plant) {
            console.log('Plant not found:', req.params.plantId);
            return res.status(404).json({ message: "Plant not found" });
        }
        console.log('Plant found:', plant._id);
        res.status(200).json({
            success: true,
            plant: plant
        });
    } catch (error) {
        console.error('502 SERVER ERR at plant retrieval', error);
        res.status(500).json({ message: "Error loading plant details" });
    }
}
}

