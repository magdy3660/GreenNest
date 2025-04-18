// models/favourite.js
const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',           
    required: false      
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// add an index so a user can't favourite the same species twice
favouriteSchema.index({ user: 1, species: 1 }, { unique: true });

module.exports = mongoose.model('Fav', favouriteSchema);