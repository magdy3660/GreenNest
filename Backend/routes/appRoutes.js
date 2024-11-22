
const router = require('express').Router()
const path = require('path')
const scanController = require('../controllers/scanController')
const auth = require('../middleware/auth')
// app.use(cors());
router.get("/", (req, res) => {
    res.send('<h1>landing page</h1> <a>Analyze plant src="/uplad"</a>')

    // if auth redirect to /dashboard
    // if guest redirecto to /landing

});
router.get('/landin', (req, res) => {
    res.send('<h1>landing page</h1> <a>Analyze plant src="/uplad"</a>')
})



router.get('/scan', (req, res) => {
    res.sendFile(path.join(__dirname,'../','views','upload.html'))

});



// Change this to post later 
router.post("/api/scan",auth,scanController.postScan)
    


router.get('/results', (req, res) => {
    res.send('<h1>analysis page</h1>')
})



router.get('/diseaseDatabase', (req, res) => {
    res.send('<h1>disease database page</h1>')
})


module.exports = router
