const Plant = require('../models/plant');
const Image = require('../models/image');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Helper function to analyze plant image with AI model
async function analyzeImage(imagePath) {
    try {
        console.log('Analyzing image with AI model:', imagePath);
        const aiEndpoint = process.env.AI_ENDPOINT;
        
        // For testing, return mock AI analysis
        return {
            diagnosis: "Healthy",
            confidence: 0.95,
            recommendations: [
                "Continue with current care routine",
                "Maintain consistent watering schedule",
                "Monitor for any changes in leaf color"
            ]
        };
        
        // TODO: Implement actual AI analysis
        /*
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));
        
        const response = await axios.post(aiEndpoint, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${process.env.AI_API_KEY}`
            }
        });
        
        return response.data;
        */
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw new Error('Failed to analyze image with AI model');
    }
}

// Middleware to check authentication
const checkAuth = (req, res, next) => {
    if (!req.user) {
        console.log('Unauthorized access attempt');
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
};

// Get all plants for authenticated user
exports.getPlants = [checkAuth, async (req, res) => {
    try {
        const plants = await Plant.find({ user: req.user._id })
            .populate('image')  // Populate the main image
            .populate('history.image')  // Populate images in history
            .sort({ lastUpdated: -1 });
        
        // Ensure all plants have valid images
        const validPlants = plants.filter(plant => {
            const hasMainImage = plant.image && plant.image.path;
            const hasValidHistoryImages = plant.history.every(entry => entry.image && entry.image.path);
            return hasMainImage && hasValidHistoryImages;
        });

        res.status(200).json({
            success: true,
            plants: validPlants
        });
    } catch (error) {
        console.error('Get plants error:', error);
        res.status(500).json({ message: "Error fetching plants" });
    }
}];

// Get specific plant details
exports.getPlant = [checkAuth, async (req, res) => {
    try {
        const plant = await Plant.findOne({
            _id: req.params.plantId,
            user: req.user._id
        })
        .populate('image')  // Populate the main image
        .populate('history.image');  // Populate images in history

        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        // Verify image existence
        if (!plant.image || !plant.image.path) {
            return res.status(404).json({ message: "Plant image not found" });
        }

        // Verify history images
        plant.history = plant.history.filter(entry => entry.image && entry.image.path);

        res.status(200).json({
            success: true,
            plant
        });
    } catch (error) {
        console.error('Get plant error:', error);
        res.status(500).json({ message: "Error fetching plant details" });
    }
}];

// Track a new plant
exports.trackPlant = [checkAuth, async (req, res) => {
    try {
        console.log('Tracking new plant for user:', req.user._id);
        console.log('Plant data:', req.body);

        if (!req.file) {
            return res.status(400).json({ message: "Please provide a plant image" });
        }

        // Create image document
        const image = new Image({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        await image.save();

        // Analyze image with AI
        const aiAnalysis = await analyzeImage(req.file.path);

        // Create plant document
        const plantData = {
            user: req.user._id,
            plantName: req.body.plantName,
            plantType: req.body.plantType,
            image: image._id,
            health: aiAnalysis.diagnosis,
            notes: req.body.notes,
            aiAnalysis: aiAnalysis
        };

        const plant = new Plant(plantData);
        await plant.save();

        res.status(201).json({ 
            message: "Plant analyzed and saved for tracking",
            plant
        });
    } catch (error) {
        console.error('Track plant error:', error);
        res.status(500).json({ message: "Error analyzing and saving plant" });
    }
}];

// Add new scan to existing plant
exports.addNewScan = [checkAuth, async (req, res) => {
    try {
        console.log('Adding new scan for plant:', req.params.plantId);
        console.log('Scan data:', req.body);

        const plant = await Plant.findOne({
            _id: req.params.plantId,
            user: req.user._id
        });

        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please provide a plant image" });
        }

        // Create image document for the new scan
        const image = new Image({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        await image.save();

        // Analyze new image
        const aiAnalysis = await analyzeImage(req.file.path);

        // Add new scan to history
        plant.history.push({
            date: new Date(),
            health: aiAnalysis.diagnosis,
            notes: req.body.notes,
            image: image._id,
            aiAnalysis: aiAnalysis
        });

        // Update current health status
        plant.health = aiAnalysis.diagnosis;
        plant.aiAnalysis = aiAnalysis;
        plant.lastUpdated = new Date();

        await plant.save();

        res.status(200).json({
            message: "New scan added successfully",
            plant
        });
    } catch (error) {
        console.error('Add scan error:', error);
        res.status(500).json({ message: "Error adding new scan" });
    }
}];

// Delete a plant
exports.deletePlant = [checkAuth, async (req, res) => {
    try {
        const plant = await Plant.findOne({
            _id: req.params.plantId,
            user: req.user._id
        });

        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }

        // Delete main image
        if (plant.image) {
            const mainImage = await Image.findById(plant.image);
            if (mainImage) {
                fs.unlinkSync(mainImage.path);
                await Image.findByIdAndDelete(mainImage._id);
                console.log('Deleted main image:', mainImage._id);
            }
        }

        // Delete history images
        for (const entry of plant.history) {
            if (entry.image) {
                const historyImage = await Image.findById(entry.image);
                if (historyImage) {
                    fs.unlinkSync(historyImage.path);
                    await Image.findByIdAndDelete(entry.image);
                    console.log('Deleted history image:', entry.image._id);
                }
            }
        }

        await Plant.findByIdAndDelete(plant._id);

        res.status(200).json({
            success: true,
            message: 'Plant deleted successfully'
        });
    } catch (error) {
        console.error('Delete plant error:', error);
        res.status(500).json({ message: "Error deleting plant" });
    }
}];

// Render dashboard with plants
exports.renderDashboard = [checkAuth, async (req, res) => {
    try {
        console.log('Rendering dashboard for user:', req.user._id);
        const user = await User.findById(req.user._id).select('-password');
        const plants = await Plant.find({ user: req.user._id })
            .populate('image')
            .populate('history.image')
            .sort('-lastUpdated');

        console.log(`Found ${plants.length} plants for user`);
        res.render('dashboard', { user, plants });
    } catch (error) {
        console.error('Dashboard render error:', error);
        res.status(500).render('error', { message: 'Error loading dashboard' });
    }
}];

// Render track plant form
exports.renderTrackPlantForm = [checkAuth, (req, res) => {
    console.log('Rendering track plant form for user:', req.user._id);
    res.render('track-plant');
}];

// Render individual plant view
exports.renderPlantView = [checkAuth, async (req, res) => {
    try {
        console.log('Rendering plant view for plant:', req.params.plantId);
        const plant = await Plant.findOne({
            _id: req.params.plantId,
            user: req.user._id
        }).populate(['image', 'history.image']);

        if (!plant) {
            console.log('Plant not found:', req.params.plantId);
            return res.status(404).render('error', { message: 'Plant not found' });
        }

        console.log('Plant found:', plant._id);
        res.render('view-plant', { plant });
    } catch (error) {
        console.error('Plant view render error:', error);
        res.status(500).render('error', { message: 'Error loading plant details' });
    }
}];

exports.getTrackingList = [checkAuth, async (req, res) => {
    try {
        console.log('Fetching tracking list for user:', req.user._id);
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            console.log('User not found:', req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }
            
        const userPlants = await Plant.find({ user: user._id })
            .populate('image')
            .populate('history.image');

        console.log(`Found ${userPlants.length} plants for user`);
        res.status(200).json({
            user: user,
            plants: userPlants
        });
    } catch (error) {
        console.error('Get tracking list error:', error);
        res.status(500).json({ message: 'Error fetching Dashboard' });
    }
}];

// Guest scan endpoint - no authentication required
exports.guestScan = async (req, res) => {
    try {
        console.log('Processing guest scan request');

        if (!req.file) {
            return res.status(400).json({ message: "Please provide a plant image" });
        }

        const aiAnalysis = await analyzeImage(req.file.path);

        // Clean up uploaded file since we don't need to store it
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: "Plant analyzed successfully",
            analysis: aiAnalysis
        });
    } catch (error) {
        console.error('Error in guest scan:', error);
        return res.status(500).json({ message: 'Error analyzing plant' });
    }
};

// Render guest scan page
exports.renderGuestScan = (req, res) => {
    res.render('guest-scan');
};