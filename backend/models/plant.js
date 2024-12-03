const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({

    plant_name: {
        type: String,
        required: true
    },

    plant_images: [{
        image:{
            type:String,
            required:true
    }
    }],
    plant_health_issues: {
        common_diseases: [String],
        recommendations: [String]
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Plant model
const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;