const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    scan_time: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
        predicted_disease: {
            type: String,
            required: true,
        },
    image_metadata: {
        image_name: {
            type: String,
            required: true
        },
        image_path: {
            type: String,
            required: true
        }
    },
});

// Add index for faster queries
historySchema.index({ user: 1, createdAt: -1 });

const History = mongoose.model('History', historySchema);
module.exports = History;
