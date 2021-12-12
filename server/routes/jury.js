const express = require('express') ;
const juryController = require('../contollers/juryController');
const router = express.Router();
const {check} = require('express-validator');


router.post('/newjury',[
   
],juryController.newjury) ;



module.exports = router;