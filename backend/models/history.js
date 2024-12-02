const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    confidence: {
        type: Number,
        min: 0,
        max: 100
    },
    status: String,
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
historySchema.index({ user: 1, createdAt: -1 });

const History = mongoose.model('History', historySchema);
module.exports = History;