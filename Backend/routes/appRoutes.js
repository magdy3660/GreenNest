
const router = require('express').Router()
const path = require('path')
const scanController = require('../controllers/scan')
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
// router.post("/upload",upload.single('upimage'), (req, res) => { 
    // upload to cloud storage

    // upload to AI MODEL  using API
 
    // get response from AI MODEL
    // Store plant to userPlants table



router.post("/api/scan", (req, res) => {
       scanController.postScan(req, res)

     })
    


router.get('/results', (req, res) => {
    res.send('<h1>analysis page</h1>')
})



router.get('/diseaseDatabase', (req, res) => {
    res.send('<h1>disease database page</h1>')
})


module.exports = router
