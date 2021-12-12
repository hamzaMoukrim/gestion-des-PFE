const express = require('express');
const usersController = require('../contollers/userConroller.js')
const router =express.Router();


router.post('/login',usersController.login)
router.post('/newStudent',usersController.addUser)

module.exports = router;