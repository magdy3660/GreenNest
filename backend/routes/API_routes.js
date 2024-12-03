const plantController = require('../controllers/plantController');
const loginController = require('../controllers/authControllers/loginController');
const router = require('express').Router();
const auth = require('../middleware/auth');
// Auth
router.post('/api/v1/register', loginController.register);  
router.post('/api/v1/login', loginController.login);  

// user
router.post('/api/v1/users/:userId/upload', auth, plantController.uploadMiddleware, plantController.scanPlant);  // New scan endpoint
router.get('/api/v1/users/:userId/history', auth, plantController.getHistory);
router.delete('/api/v1/users/:userId/history/:historyId', auth, plantController.deleteScan);

// Library
router.get('/api/v1/library/plants', auth, plantController.getPlants);
router.get('/api/v1/library/plants/:plantId', auth, plantController.getPlant);

//  404 handler
router.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'endpoint not found' 
    });
});

module.exports = router;