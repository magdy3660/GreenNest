const LibraryService = require("../services/library_service");
exports.getAllPlants = async (req, res) => {
  const page = req.query.page;
  const results = await LibraryService.getSpecies(page);
  res.status(200).json({
    message: "Retrieved 20 Entries of 416557 for page " + page,
    species: results.species,
    page: results.page,
    hasNextPage: results.hasNextPage,
    hasPreviousPage: results.hasPreviousPage,
    nextPage: results.nextPage,
    previousPage: results.previousPage,
    lastPage: results.lastPage,
  });
};
