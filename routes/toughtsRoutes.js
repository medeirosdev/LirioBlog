const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')

// Helper
    const checkAuth = require('../helpers/auth').checkAuth;


router.get('/add' , checkAuth , ToughtController.createTought)
router.post('/add' , checkAuth , ToughtController.createToughtsave)
router.get('/edit/:id' , checkAuth , ToughtController.updateTought)
router.post('/edit' , checkAuth , ToughtController.updateToughtsave)
router.get('/dashboard' , checkAuth , ToughtController.dashboard)
router.get('/' , ToughtController.showToughts)
router.post('/remove',checkAuth ,ToughtController.removeTought)





module.exports = router