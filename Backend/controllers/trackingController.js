//++++ TRACKING CONTROLLER +++++

const TrackedPlant = require('../models/plantTracking'); //track plant class

exports.getTrackedPlants = async (req, res) => {
    const plants = TrackedPlant.fetchAll();
    res.status(200).json(plants);
}



exports.trackPlant = async (req, res) => {
    const plantData = req.body;
    
try {

    const plant = new TrackedPlant(plantData);
    plant.save();
    res.status(200).json({ message: "Plant saved for Tracking"});

    
} catch (error) {
    res.status(500).json({ message: "Error saving plant for tracking"});
}
}

exports.viewTrackedPlant = async (req, res) => {
    const plantId = req.params.plantId;
    const tracketPlantData = TrackedPlant.findById(plantId);
    res.status(200).json(tracketPlantData);
}


exports.removeTrackedPlant = async (req, res) => {
    const plantId = req.params.plantId;
    TrackedPlant.remove(plantId);
    //DROP
    res.status(200).json("Removed Plant from Tracking list");
}