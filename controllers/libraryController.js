const LibraryService = require("../services/library_service");
exports.getAllPlants = async (req, res) => {
  const page = req.query.page;
  const results = await LibraryService.getSpecies(page);
  res.status(200).json({
  // Data
   message: "Retrieved 30 Entries of 416557 for page " + results.currentPage,

    species: results.species,
  
    // Pagination info
  pagination: {
    currentPage: results.currentPage,
    totalPages: results.lastPage,
    hasNext: results.hasNextPage,
    hasPrevious: results.hasPreviousPage,
    nextPage: results.nextPage,
    previousPage: results.previousPage,
  },

  });
};

//  view specific plant detail
exports.getPlantById = async (req, res) => {
  try {
    const plantId = req.params.specieId;
    const plant = await LibraryService.getSpeciesById(plantId);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: "Plant not found"
      });
    }

    res.status(200).json({
      success: true,
      plant
    });
  } catch (error) {
    console.error("Error fetching plant:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving plant details"
    });
  }
};

