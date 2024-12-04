const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image_metadata: {
        type: String,
        image_name:{
            type: String,
            required: true
        },
        image_path:{
            type: String,
            required: true
        },
    },
    AiScanResults: [{
        simillar_images: [String],
        detected_disease: {
            type: String,
            required: true,
        },
        confidence: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },
        disease_info: {
            type: String,
            required: false
        },
        remediation_action: {
            type: String,
            required: true,
        },
        diagnosisDate:{
        type: String,
        required: true,
    }

    }],
});

// Add index for faster queries
historySchema.index({ user: 1, createdAt: -1 });

const History = mongoose.model('History', historySchema);
module.exports = History;