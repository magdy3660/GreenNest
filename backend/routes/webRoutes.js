const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const loginController = require('../controllers/authControllers/loginController')
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

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

// Web routes (rendering views)
router.get('/',loginController.getLoginPage)
router.get('/scan', auth, plantController.renderScanPage);
router.post('/scan', auth, upload.single('plantImage'), plantController.scanPlant);
router.get('/scan-results/:scanId', auth, plantController.renderScanResults);
router.get('/dashboard', auth, plantController.renderDashboard);
router.get('/guest-scan', plantController.renderGuestScan);

// 404 handler for web routes
router.use((req, res) => {
    res.status(404).render('404', { 
        message: 'Page not found' 
    });
});

module.exports = router;
