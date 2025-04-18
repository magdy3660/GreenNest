const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
  scanTime: {
    type: Date,
    default: Date.now
  },
  disease: {
    type: String,
    required: true
  }, 
  confidence:{
    type: Number,
    required:true,
  },
  remediations: {
    type: String,     // list of steps
    default: []
  },
  imageMetadata: {
    imageName: { type: String, required: true },
    imagePath: { type: String, required: true }
  }
});

ScanSchema.index({ user: 1, scan_time: -1 });

module.exports = mongoose.model('Scan', ScanSchema);