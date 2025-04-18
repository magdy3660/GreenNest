// models/trackedPlant.js
const mongoose = require('mongoose');

const trackedPlantSchema = new mongoose.Schema({
  plant_name: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  illnessHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan'
  }],
  status: {
    type: String,
    enum: ['healthy', 'diseased', 'unknown'],
    default: 'unknown'
  }
}, {
  timestamps: true   // adds createdAt & updatedAt
});

// Optional index if you query by plant_name often
trackedPlantSchema.index({ plant_name: 1 });

module.exports = mongoose.model('TrackedPlant', trackedPlantSchema);
