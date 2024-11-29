const mongoose = require('mongoose');

const plantTrackingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  currentHealth: {
    diagnosis: String,
    confidence: Number,
    recommendations: [String],
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  history: [{
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    },
    diagnosis: String,
    confidence: Number,
    recommendations: [String],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated timestamp before saving
plantTrackingSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('PlantTracking', plantTrackingSchema);
