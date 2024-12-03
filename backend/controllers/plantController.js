const History = require('../models/history');
const User = require('../models/user');
const plant_service = require('../services/plant_service');


// Get all plants for authenticated user
exports.getPlants = async (req, res) => {
    try {
        const plants = await plant_service.getAllPlant(req.userId)

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
        const plant = plant_service.getPlant(req.params.plantId, req.userId)

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
        const plant = await plant_service.deleteScan(req.params.historyId, req.userId)

        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        fs.unlinkSync(plant.imageUrl);
        await Plant.findByIdAndDelete(plant._id);

        console.log('Deleted main image:', plant.imageUrl);

        res.status(200).json({
            success: true,
            message: 'Scan deleted successfully'
        });
    } catch (error) {
        console.error('Delete plant error:', error);
        res.status(500).json({ message: "Error deleting plant" });
    }
}

exports.getDashboard = async (req, res) => {
    try {
        console.log('Rendering dashboard for user:', req.user._id);

        const history = await History.find({ user: req.user._id })
            .populate({
                select: 'name image _id'
            })
        console.log(`Found ${history.length}  entries for user`);
        res.status(200).json({
            message: 'dashboard loaded',
            history: {
                id: history._id,
                name: history.name,
                image: history.image
            },
            user: req.user
        });

    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).json({
            message: 'Error loading dashboard: ' + error.message,
            user: req.user
        });
    }
}


exports.getPlant = async (req, res) => {
    try {
        const plant = await plant_service.getHistoryById(req.params.plantId, req.user._id)


        if (!plant) {
            console.log('Plant not found:', req.params.plantId);
            return res.status(404).render('error', { message: 'Plant not found' });
        }
        console.log('Plant found:', plant._id);
        res.status(200).json({
            success: true,
            plant: plant
        });
    } catch (error) {
        console.error('502 SERVER ERR at plant retrieval', error);
        res.status(500).render('error', { message: 'Error loading plant details' });
    }
}


// Handle plant scan submission
exports.scanPlant = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }
        const scanResults = plant_service.scanPlant(req.file, req.user._id);
        if (!scanData) {
            return res.status(500).json({
                message: 'Error processing plant scan'
            })
        }
        res.status(200).json({
            message: 'Plant scanned successfully',
            scanResults
        });

    } catch (error) {
        console.error('Error in scanPlant:', error);
        res.status(500).json({ message: 'Error processing plant scan: ' + error.message });
    }
}