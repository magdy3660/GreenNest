const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema({
  // Basic Information
  scientific_name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  rank: {
    type: String,
    required: false,
  },
  genus: {
    type: String,
    required: false,
  },
  family: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  bibliography: {
    type: String,
    required: false,
  },
  
  // Common Names
  common_names: {
    type: [String],
    required: true,
  },
  common_name: {
    type: String,
    required: false,
  },
  family_common_name: {
    type: String,
    required: false,
  },
  synonyms: {
    type: [String],
    required: false,
  },

  // Visual Characteristics
  image_url: {
    type: String,
    required: false,
  },
  flower_color: {
    type: String,
    required: false,
  },
  flower_conspicuous: {
    type: Boolean,
    required: false,
  },
  foliage_color: {
    type: String,
    required: false,
  },
  foliage_texture: {
    type: String,
    required: false,
  },
  fruit_color: {
    type: String,
    required: false,
  },
  fruit_conspicuous: {
    type: Boolean,
    required: false,
  },

  // Growth Information
  fruit_months: {
    type: [String],
    required: false,
  },
  bloom_months: {
    type: [String],
    required: false,
  },
  ground_humidity: {
    type: Number,
    required: false,
  },
  growth_form: {
    type: String,
    required: false,
  },
  growth_habit: {
    type: String,
    required: false,
  },
  growth_months: {
    type: [String],
    required: false,
  },
  growth_rate: {
    type: String,
    required: false,
  },

  // Edibility
  edible: {
    type: Boolean,
    required: false,
    default: false,
  },
  vegetable: {
    type: Boolean,
    required: false,
    default: false,
  },
  edible_part: {
    type: [String],
    required: false,
  },

  // Growing Requirements
  light: {
    type: Number,
    required: false,
  },
  soil_nutriments: {
    type: Number,
    required: false,
  },
  soil_salinity: {
    type: Number,
    required: false,
  },
  anaerobic_tolerance: {
    type: String,
    required: false,
  },
  atmospheric_humidity: {
    type: Number,
    required: false,
  },

  // Physical Characteristics
  average_height_cm: {
    type: Number,
    required: false,
  },
  maximum_height_cm: {
    type: Number,
    required: false,
  },
  minimum_root_depth_cm: {
    type: Number,
    required: false,
  },
  ph_maximum: {
    type: Number,
    required: false,
  },
  ph_minimum: {
    type: Number,
    required: false,
  },

  // Planting Information
  planting_days_to_harvest: {
    type: Number,
    required: false,
  },
  planting_description: {
    type: String,
    required: false,
  },
  planting_sowing_description: {
    type: String,
    required: false,
  },
  planting_row_spacing_cm: {
    type: Number,
    required: false,
  },
  planting_spread_cm: {
    type: Number,
    required: false,
  },

  // Distribution
  distributions: {
    type: [String],
    required: false,
  },

  // External URLs
  url_usda: {
    type: String,
    required: false,
  },
  url_tropicos: {
    type: String,
    required: false,
  },
  url_tela_botanica: {
    type: String,
    required: false,
  },
  url_powo: {
    type: String,
    required: false,
  },
  url_plantnet: {
    type: String,
    required: false,
  },
  url_gbif: {
    type: String,
    required: false,
  },
  url_openfarm: {
    type: String,
    required: false,
  },
  url_catminat: {
    type: String,
    required: false,
  },
  url_wikipedia_en: {
    type: String,
    required: false,
  },

  // Disease Information
  diseases: {
    type: [{
      name: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      symptoms: {
        type: [String],
        required: false,
        default: [],
      },
      causes: {
        type: [String],
        required: false,
        default: [],
      },
      treatment: {
        type: [String],
        required: false,
        default: [],
      },
      healthy_images: {
        type: [String],
        required: false,
        default: [],
      },
      diseased_images: {
        type: [String],
        required: false,
        default: [],
      },
    }],
    default: [],
  },
});

module.exports = mongoose.model("Species", speciesSchema);
