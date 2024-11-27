const router = require('express').Router();
const registerController = require('../controllers/authControllers/registerController');
const loginController = require('../controllers/authControllers/loginController');
const plantController = require('../controllers/plantController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Public Routes
router.get('/', (req, res) => res.redirect('/dashboard'));
router.get('/register', registerController.getRegisterPage);
router.get('/login', loginController.getLoginPage);
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/guest/scan', plantController.renderGuestScan);
router.post('/api/guest/scan', upload.single('file'), plantController.guestScan);

// Protected Web Routes (all need auth middleware)
router.get('/dashboard', auth, plantController.renderDashboard);
router.get('/track-plant', auth, plantController.renderTrackPlantForm);
router.get('/plants/:plantId', auth, plantController.renderPlantView);

// Protected API Routes
router.get('/api/dashboard', auth, plantController.getTrackingList);

// Error Routes
router.use((req, res) => res.status(404).render('404'));

module.exports = router;