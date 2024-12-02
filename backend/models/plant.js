const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plantName: {
        type: String,
        required: true
    },
    plantType: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    status: String,
    notes: String,
    aiAnalysis: {
        diagnosis: String,
        confidence: Number,
        recommendations: [String]
    },
    history: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'History'
    },
    trackStartDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Plant model
const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;