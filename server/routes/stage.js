const express = require('express');
const stageController = require('../contollers/stageController')
const router =express.Router();
const { check } = require('express-validator');
const fileUpload = require('../middlware/file-upload')
const HttpError = require("../models/Http-error");
const Stage = require("../models/stage");
const mongoose = require("mongoose");
const DocsAdmin = require("../models/docAdmin");
const { validationResult } = require("express-validator");


//userId
router.post('/newstage',fileUpload.single('file'),
  [check('tel').not().isEmpty(),check('email').normalizeEmail().isEmail(),check('organisme').not().isEmpty()
  ,check('rep').not().isEmpty(),check('encExterne').not().isEmpty(),check('emailEncadrantExterne').normalizeEmail().isEmail(),check('description').not().isEmpty(),
 check('ville').not().isEmpty(),check('pays').not().isEmpty(),/*check(JSON.parse(selectedProfs)).isArray({ min: 0, max: 10 }),*/
 check('startDate').not().isEmpty(),check('finDate').not().isEmpty()
],

 stageController.newStage)

 router.get('/',stageController.getStages)
 // add enseignant function stages to route
 router.get('/:userId',stageController.getEnseigantStages);
 //---------------------------------


 router.post('/addKeywords',stageController.addKeywords)

 router.post('/valider',stageController.validerStage)
 router.delete('/delete',stageController.deleteStage)

 router.get('/stages/valides',stageController.getStagesValides) ;
 router.get('/stage/:stageID',stageController.getStage);
 
 router.get('/stageInfo/:pid',stageController.getStageInfo)

 router.post('/rapport',fileUpload.single('file'),check('stageId').not().isEmpty(),async (req, res, next) => {


  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs saisient invalide", 422));
  }


  const {stageId } = req.body;
  console.log(stageId)
  console.log(req.file.path)
  let stage ;

  try {
    stage = await Stage.findById(stageId);
  } catch (error) {
    const er = new HttpError("finding stage failed, please try again.", 500);
    return next(er);
  }

if (stage==null) {
  const er = new HttpError("finding stage failed, please try again.", 500);
  return next(er);
}

  const newDoc = new DocsAdmin({
    nom: "rapport",
    description : "rapport",
    url : req.file.path,
    type:"rapport",
    stageId:stageId
  })
  



  try {


    const sess = await mongoose.startSession(); // open a session
    sess.startTransaction();
  
     await newDoc.save({session: sess})
     stage.docs.push(newDoc)
    await stage.save({session: sess});
  
    sess.commitTransaction();

 
    
  } catch (error) {
    const er = new HttpError("Saving rapport failed, please try again.", 500);
    return next(er);
  }

  res.status(201).json({ message:"Les rapport est ajoute" });
 })

 

module.exports = router;
