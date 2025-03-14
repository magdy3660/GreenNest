const History = require('../models/history');
const User = require('../models/user');
const DB_service = require('../services/DB_service');
const storage_service = require('../services/storage_service');

// Get all plants for authenticated user

exports.getPlants = async (req, res) => {
    try {
        const plants = await DB_service.getAllPlant(req.userId)

        res.status(200).json({
            success: true,
            plants: plants
        });
    } catch (error) {
        console.error('Get plants error:', error);
        res.status(500).json({ message: "Error fetching plants" });
    }
}

// Get specific plant details
exports.getPlant = async (req, res) => {
    try {
        const plant = DB_service.getPlant(req.params.plantId, req.userId)

        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        // Verify image existence
        if (!plant.image || !plant.image.path) {
            console.log('Plant image not found:', req.params.plantId);
            next()
            // return res.status(404).json({ message: "Plant image not found" });
        }

    } catch (error) {
        console.error('Get plant error:', error);
        res.status(500).json({ message: "Error fetching plant details" });
    }
}

// Delete a scan
exports.deleteScan = async (req, res) => {
    try {
        const plant = await DB_service.deleteScan(req.params.plantId, req.userId)

        res.status(200).json({
            success: true,
            message: 'Scan deleted successfully' + plant.name
        });
    } catch (error) {
        console.error('Delete plant error:', error);
        res.status(500).json({ message: "Error deleting plant" });
    }
}

exports.getDashboard = async (req, res) => {
    try {
        console.log('Getting dashboard for user:', req.user._id);

        const histories = await DB_service.getAllPlant(req.user._id);
        console.log(`Found ${histories.length} entries for user`);

        // Map the array to get only the needed fields
        const formattedHistories = histories.map(history => ({
            id: history._id,
            name: history.name,
            image: history.image
        }));

        res.status(200).json({
            success: true,
            message: 'Dashboard loaded',
            histories: formattedHistories,
            user: req.user
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: "Error loading dashboard" });
    }
}


exports.getPlant = async (req, res) => {
    try {
        const plant = await DB_service.getPlant(req.params.plantId, req.user._id)


        if (!plant) {
            console.log('Plant not found:', req.params.plantId);
            return res.status(404).json({ message: "Plant not found" });
        }
        console.log('Plant found:', plant._id);
        res.status(200).json({
            success: true,
            plant: plant
        });
    } catch (error) {
        console.error('502 SERVER ERR at plant retrieval', error);
        res.status(500).json({ message: "Error loading plant details" });
    }
}
