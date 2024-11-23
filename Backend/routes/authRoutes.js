const authController = require('../controllers/authController')
const plantController = require('../controllers/trackingController')
const router = require('express').Router()
const {auth}= require('../middleware/auth')



router.post('/login', authController.login)
router.get('/dashboard', authController.getDashboard)
router.post('/register', authController.register)
// Authenticated routes 
router.get('/history', authController.getHistory)

// router.post('/profile', userController.updateProfile)

// //++++++++++++++ PLANT TRACKING +++++++++++++++==
router.post('/trackPlant', plantController.trackPlant)
// router.get('/tracking', userController.getTracking)
router.post('/removePlant/:id', plantController.removeTrackedPlant)
router.get('/viewTrackedPlant/:plantId', plantController.viewTrackedPlant)

module.exports = router

module.exports = router
