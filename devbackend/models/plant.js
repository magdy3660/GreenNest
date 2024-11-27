const mongoose = require('mongoose');

const PlantTrackingSchema = new mongoose.Schema({
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
    health: String,
    notes: String,
    aiAnalysis: {
        diagnosis: String,
        confidence: Number,
        recommendations: [String]
    },
    history: [{
        date: {
            type: Date,
            default: Date.now
        },
        health: String,
        notes: String,
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
            required: true
        },
        aiAnalysis: {
            diagnosis: String,
            confidence: Number,
            recommendations: [String]
        }
    }],
    trackStartDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const PlantTracking = mongoose.model('PlantTracking', PlantTrackingSchema);
module.exports = PlantTracking;