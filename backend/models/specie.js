const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema({
  common_names: {
    type: [String],
    required: true,
  },
  scientific_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  growing_requirements: {
    soil_type: {
      type: String,
      required: false,
    },
    sunlight: {
      type: String,
      required: false,
    },
    climate: {
      type: String,
      required: false,
    },
  },
  affected_parts: {
    type: [String],
    required: false,
    default: [],
    edible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  diseases: {
    type: [
      {
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
      },
    ],
    default: [],
  },
  // Additional fields from Trefle API
  family: {
    type: String,
    required: false,
  },
  humidity: {
    type: String,
    required: false,
  },
  wiki_url: {
    type: String,
    required: false,
  },
  image_url: {
    type: String,
    required: false,
  },
  distributions: {
    type: [String],
    required: false,
  },
  growth_habit: {
    type: String,
    required: false,
  },
  planting_days_to_harvest: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Species", speciesSchema);
