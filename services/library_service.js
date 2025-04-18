const Specie = require("../models/species");
const mongoose = require("mongoose");

const ITEMS_PER_PAGE = 30;
const DEFAULT_TOTAL_PLANTS = 416557;

class LibraryService {

  // get all plants
  static async getSpecies(page) {
 
    const currentPage = parseInt(page) || 1;

    try {
      const species = await Specie.find()
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

        const catalog = species.map(specie => ({
          speciesId: specie._id,
          scientific_name: specie.scientific_name,
          image_url: specie.image_url
        }));
      return {
        species:catalog,
        currentPage: currentPage,
        hasNextPage: ITEMS_PER_PAGE * currentPage < DEFAULT_TOTAL_PLANTS,
        hasPreviousPage: currentPage > 1,
        nextPage: currentPage + 1,
        previousPage: currentPage - 1,
        lastPage: Math.ceil(DEFAULT_TOTAL_PLANTS / ITEMS_PER_PAGE), //415667/20
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
//  get specific plant 
  static async getSpeciesById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid species ID format');
      }
      const species = await Specie.findById(id);
      if (!species) {
        throw new Error('Species not found');
      }
      return species;
    } catch (error) {
      console.error('Error fetching species by ID:', error);
      throw error;
  }
}
}
module.exports = LibraryService;
