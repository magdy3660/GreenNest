const userController = require('../controllers/userController')
const plantController = require('../controllers/trackingController')
const router = require('express').Router()




// router.get('/register', userController.getRegister)
// router.post('/settings', userController.postSettings)
router.get('/login', userController.getLogin)
router.post('/login', userController.postLogin)
router.get('/dashboard', userController.getDashboard)

// Authenticated routes 
router.get('/history', userController.getHistory)

router.get('/profile', (req, res) => res.send('<h1>PROFILE page</h1>'))

// When you click on a plant from tracked plants
// // router.get('/settings', userController.getSettings)

// router.post('/profile', userController.updateProfile)

// //++++++++++++++ PLANT TRACKING +++++++++++++++==
router.post('/trackPlant', plantController.trackPlant)
// router.get('/tracking', userController.getTracking)
router.post('/removePlant/:id', plantController.removeTrackedPlant)
router.get('/viewTrackedPlant/:plantId', plantController.viewTrackedPlant)

module.exports = router

module.exports = router
