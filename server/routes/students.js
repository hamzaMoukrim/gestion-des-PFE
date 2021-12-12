const express = require('express');
const studentController = require('../contollers/studentController')
const router =express.Router();
const { check } = require('express-validator');



router.post('/student/delete',[check('studentId').not().isEmpty()],
studentController.deleteStudent)



router.get('/',
 studentController.getstudents)

  


 router.post('/addStudent',[check('filiereId').not().isEmpty(),check('optionId').not().isEmpty()],
 studentController.addStudent)



 router.post('/updateStudent',[check('studentId').not().isEmpty(),check('optionId').not().isEmpty(),check('userName').not().isEmpty(),check('password').not().isEmpty(),
 check('cne').not().isEmpty(), check('nom').not().isEmpty(), check('prenom').not().isEmpty(), check('dateNaissance').not().isEmpty(),
 check('genre').not().isEmpty(),check('matricule').not().isEmpty(),check('telephone').not().isEmpty(),check('promotion').not().isEmpty()],
 studentController.updateStudent)


 router.get('/getStudent/:pid',
 studentController.getStudent)



module.exports = router;
