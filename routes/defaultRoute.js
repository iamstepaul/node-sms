const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/defaultController')


router.route('/')
    .get(defaultController.indexGet)
    
 
    

module.exports = router
