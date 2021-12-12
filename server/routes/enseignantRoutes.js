const express = require('express');
const enseignantConroller = require('../contollers/enseignantController')
const router =express.Router();
const { check } = require('express-validator');


router.get('',enseignantConroller.allEnseignants)
router.get('/enseignants/:filiereId',enseignantConroller.enseignants)


router.post('/addEnseignants',[check('filiereId').not().isEmpty()],enseignantConroller.addEnseignants)




router.post('/updateEnseignant',[check('filiere').not().isEmpty(),check('password').not().isEmpty(),check('prenom').not().isEmpty(),check('enseignantId').not().isEmpty(),check('userName').not().isEmpty(),check('nom').not().isEmpty(),check('email').not().isEmpty()],enseignantConroller.updateEnseignant)

  

router.post('/deleteEnseignant',[check('enseignantId').not().isEmpty()],enseignantConroller.deleteEnseignant)

router.get('/engseignant/:pid',enseignantConroller.getEnseignant)

router.post('/updateChefdept',[check('enseignantId').not().isEmpty(),check('filiereId').not().isEmpty()],enseignantConroller.updateChefdept)
router.get('/getcheftDepts',enseignantConroller.getcheftDepts)



module.exports = router;