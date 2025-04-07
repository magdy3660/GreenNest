const DB_service = require('../services/DB_service');

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
