const Specie = require("../models/specie");

const ITEMS_PER_PAGE = 20;
const DEFAULT_TOTAL_PLANTS = 416557;

class LibraryService {
  static async getSpecies(page) {
    // PAGE 1-> 1-1 = 0 => 0*20 => 0, but limit is 20 so 0->19 would be returned
    // PAGE x => x-1 = n => n*20 => 20..40..60...etc

    const currentPage = parseInt(page) || 1;

    try {
      const species = await Specie.find()
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
      return {
        species: species,
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
}

module.exports = LibraryService;
