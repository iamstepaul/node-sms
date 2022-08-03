const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.route('/register')
    .get(userController.registerGet)
    .post(userController.registerPost)
 router.route('/verify')
    .get(userController.verifyGet)
    .post(userController.verifyPost)

module.exports = router