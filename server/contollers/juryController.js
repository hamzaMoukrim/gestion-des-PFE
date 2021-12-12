const HttpError = require("../models/Http-error");
const Planning = require("../models/planning");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Enseignant =  require("../models/enseignant");


const newjury = async (req,res,next) => {


if (req.body.sujet.value=="") {
  const error = new HttpError(
    "finding sujetId failed, please try again.",
    500
  );
  return next(error);
}




    let juries=[] ; //les encadrant interne
    let enseignant ,role;

    if (req.body.listeJury.length==0) {
      const error = new HttpError(
        "finding Jury failed, please try again.",
        500
      );
      return next(error);
    }
   
    try {
    for(var i = 0; i<req.body.listeJury.length;i++){
      enseignant = await Enseignant.find({ _id: req.body.listeJury[i].enseignant.value  });
      role = req.body.listeJury[i].role.label ;
      juries.push({enseignantID : enseignant[0],role : role}) ;
    }
  
    } catch (er) {
      const error = new HttpError(
        "finding enseignants failed, please try again.",
        500
      );
      return next(error);
    }

    try {
      var planning  ;

      planning =  await Planning.findOne({stageId : `${req.body.sujet.value}`}) ;

   
      if(planning != null ) {

        planning.jury[0].enseignantID = juries[0].enseignantID._id; 
        planning.jury[1].enseignantID = juries[1].enseignantID._id; 
        const sess = await mongoose.startSession(); // open a session
        sess.startTransaction();
        await planning.save({ session: sess });
        sess.commitTransaction();
      }
 else {
          const newPlanning = new Planning({
              jury : juries,
              stageId: req.body.sujet.value,
              jour:"pas encore planifier",
              heureDebut : "pas encore planifier",
              heureFin :"pas encore planifier",
              salle :"Salle 0"
          }) ;
          const sess = await mongoose.startSession(); // open a session
          sess.startTransaction();
          await newPlanning.save({ session: sess });
          
          sess.commitTransaction();
        }
    }catch(err2){
       const err = new HttpError(
      'getting stage Id failed',
      500
    );

    return next(err);
    }
   
  
  message="Le planning est Enregistre ! "
  console.log(message) ;

}

exports.newjury= newjury;