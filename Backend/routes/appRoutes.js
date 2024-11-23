
const router = require('express').Router()
const path = require('path')
const scanController = require('../controllers/scanController')
const { authOptional } = require('../middleware/auth');

router.get('/', authOptional, (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/landing');
});

module.exports = router;

router.post("/upload",authOptional,scanController.postScan)
    



module.exports = router
