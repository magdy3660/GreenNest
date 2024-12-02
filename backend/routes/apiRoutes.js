const plantController = require('../controllers/plantController');
const loginController = require('../controllers/authControllers/loginController');
const router = require('express').Router();
const auth = require('../middleware/auth');

// API Routes only
router.post('/login', loginController.login);  // API login endpoint
router.post('/plants/scan', auth, plantController.uploadMiddleware, plantController.scanPlant);  // New scan endpoint
router.get('/dashboard', auth, plantController.getTrackingList);
router.get('/plants', auth, plantController.getPlants);
router.get('/plants/:plantId', auth, plantController.getPlant);
router.delete('/plants/:plantId', auth, plantController.deletePlant);

// API 404 handler
router.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'API endpoint not found' 
    });
});

module.exports = router;