const router = require('express').Router();
const registerController = require('../controllers/authControllers/registerController');
const loginController = require('../controllers/authControllers/loginController');

// Auth Routes
router.get('/register', registerController.getRegisterPage);
router.get('/login', loginController.getLoginPage);
router.post('/register', registerController.register);
router.post('/login', loginController.login);

// Error Routes
router.use((req, res) => res.status(404).render('404'));

module.exports = router;