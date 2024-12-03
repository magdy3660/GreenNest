const History = require('../models/history');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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
        const plants = await history.find({ user: req.user._id })
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

        // Find all history entries for the current user
        const history = await History.find({ user: req.user._id })
            .populate('plant')
            .populate('image')
            .sort({ createdAt: -1 });

        console.log(`Found ${history.length} scan entries for user`);

        res.render('dashboard', {
            user: req.user,
            history: history
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).render('error', {
            message: 'Error loading dashboard: ' + error.message,
            user: req.user
        });
    }
}];

// Render track plant form
exports.renderTrackPlantForm = [checkAuth, (req, res) => {
    console.log('Rendering track plant form for user:', req.user._id);
    res.render('track-plant');
}];

// Render individual plant view
exports.getPlant = [checkAuth, async (req, res) => {
    try {
        const plant = await history.findOne({
            _id: req.params.plantId,
            user: req.user._id
        })

        if (!plant) {
            console.log('Plant not found:', req.params.plantId);
            return res.status(404).render('error', { message: 'Plant not found' });
        }
        console.log('Plant found:', plant._id);
    } catch (error) {
        console.error('502 SERVER ERR at plant retrieval', error);
        res.status(500).render('error', { message: 'Error loading plant details' });
    }
}];

exports.getHistory = [checkAuth, async (req, res) => {
    try {
        console.log('History list for user requested:', req.user._id);
        
        // Find all history entries for the user
        const historyEntries = await History.find({ user: req.user._id })
            .sort({ createdAt: -1 }); // Sort by newest first
        

 // Debug logs
 console.log('Type of historyEntries:', typeof historyEntries);
 console.log('Is Array?', Array.isArray(historyEntries));
 console.log('Length:', historyEntries.length);
 if (historyEntries.length > 0) {
     console.log('Sample entry:', JSON.stringify(historyEntries[0], null, 2));
 }


        if (historyEntries.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No history found, Start by saving your first scan',
                userId: req.user._id
            });
        }

        console.log(`Found ${historyEntries.length} history entries for user`);
        
        // Return success response with user ID and history
        res.status(200).json({
            success: true,
            userId: req.user._id,
            history: historyEntries
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching history',
            userId: req.user._id
        });
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

// Render scan page
exports.renderScanPage = [checkAuth, (req, res) => {
    res.render('scan-plant', { user: req.user });
}];

// Export multer middleware for route configuration
exports.uploadMiddleware = upload.single('plantImage');

// Handle plant scan submission
exports.scanPlant = [checkAuth, async (req, res) => {
    try {
        console.log('Processing plant scan');
        console.log('Form data:', req.body);
        console.log('User:', req.user);
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        if (!req.body.plantName || !req.body.plantType) {
            return res.status(400).json({ message: 'Plant name and type are required' });
        }

        console.log('Uploaded file:', req.file);

        // Create new Image document with all required fields
        const image = new Image({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        await image.save();
        console.log('Saved image:', image);

        // Analyze the image
        const analysis = await analyzeImage(req.file.path);
        console.log('Image analysis:', analysis);

        // Create new Plant document
        const plant = new Plant({
            user: req.user._id,
            plantName: req.body.plantName,
            plantType: req.body.plantType,
            status: analysis.diagnosis,
            image: image._id,
            aiAnalysis: {
                diagnosis: analysis.diagnosis,
                confidence: analysis.confidence || 0.8,
                recommendations: analysis.recommendations || []
            }
        });
        await plant.save();
        console.log('Saved plant:', plant);

        // Create History entry
        const history = new History({
            user: req.user._id,
            plant: plant._id,

        });
        await history.save();
        console.log('Saved history:', history);

        // Redirect to scan results page with the plant ID
        res.redirect(`/scan-results/${plant._id}`);
    } catch (error) {
        console.error('Error in scanPlant:', error);
        res.status(500).json({ message: 'Error processing plant scan: ' + error.message });
    }
}];

// Render scan results page
exports.renderScanResults = [checkAuth, async (req, res) => {
    try {
        console.log('Rendering scan results for plant ID:', req.params.scanId);

        if (!req.params.scanId) {
            console.log('No scan ID provided');
            return res.status(400).render('error', { 
                message: 'No scan ID provided',
                user: req.user 
            });
        }

        // Find the plant with its image and history
        const plant = await Plant.findById(req.params.scanId)
            .populate('image')
            .populate('user')
            .populate({
                path: 'history',
                populate: {
                    path: 'image'
                }
            });

        console.log('Found plant:', plant);

        if (!plant) {
            console.log('Plant not found');
            return res.status(404).render('error', { 
                message: 'Scan results not found',
                user: req.user 
            });
        }

        // Compare user IDs as strings
        const plantUserId = plant.user && plant.user._id ? plant.user._id.toString() : plant.user.toString();
        const currentUserId = req.user._id.toString();

        if (plantUserId !== currentUserId) {
            console.log('Unauthorized access attempt', {
                plantUserId,
                currentUserId
            });
            return res.status(403).render('error', { 
                message: 'You do not have permission to view these results',
                user: req.user 
            });
        }

        // Find the latest history entry for this plant
        const latestHistory = await History.findOne({ plant: plant._id })
            .sort({ createdAt: -1 })
            .populate('image');

        console.log('Rendering scan results with plant:', {
            id: plant._id,
            name: plant.plantName,
            type: plant.plantType,
            status: plant.status,
            hasImage: !!plant.image,
            hasHistory: !!latestHistory
        });

        // Render the scan results page
        res.render('scan-results', {
            user: req.user,
            plant: plant,
            history: latestHistory,
            analysis: plant.aiAnalysis || {},
            imageUrl: plant.image ? `/uploads/${plant.image.filename}` : null
        });

    } catch (error) {
        console.error('Error rendering scan results:', error);
        res.status(500).render('error', { 
            message: 'Error loading scan results: ' + error.message,
            user: req.user 
        });
    }
}];