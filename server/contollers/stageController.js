const HttpError = require("../models/Http-error");
const Stage = require("../models/stage");
const mongoose = require("mongoose");
const Etudiant = require("../models/etudiant");

const User = require("../models/user");
const Enseignant = require("../models/enseignant");
const DocsAdmin = require("../models/docAdmin");
const { validationResult } = require("express-validator");

const fs = require('fs');

//get stages

const getStages = async (req, res, next) => {
  let stages;
  try {
    stages = await Stage.find({}).populate('etudiants', "nom prenom cin")
                                           
                                  
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Fetching stages failed, please try again later.",
      500
    );
    return next(error);
  }

  let user,docPFE,rapport;


  try {
    for (var i = 0; i < stages.length; i++) {
      user = await User.find({ studentId: stages[i].etudiants }
      //    [
      //   // "nom",
      //   // "prenom",
      // ]
      );

    user.map((e,index)=>{
      stages[i].etudiants[index].cin = e._id;

    })

      
    }
  } catch (er) {
    console.log(err)
    const error = new HttpError(
      "finding students failed, please try again",
      500
    );
    return next(error);
  }


  for (var i = 0; i < stages.length; i++) {
    docPFE = await  DocsAdmin.find({_id:stages[i].docs[0]}, [
      "url",
    ]);
    stages[i].docs = docPFE;
  }



  res.status(201).json({ stages: stages });
};





//----------------------------------------------------------------------------------------
// add stage

const newStage = async (req, res, next) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs saisient invalide", 422));
  }
  const {
    binome,
    email,
    tel,
    organisme,
    rep,
    encExterne,
    description,
    ville,
    pays,
    selectedProfs,
    startDate,
    finDate,
    userId,
    emailEncadrantExterne
  } = req.body;

   let profs = JSON.parse(selectedProfs)


  console.log(profs)
  let etudiants,message;
  try {
    if(binome==""){
      etudiants = await Etudiant.find({ _id: userId });

    }else{
    etudiants = await Etudiant.find({ _id: [userId, binome] }); }
  }catch (er) {

      const error = new HttpError(
      "finding students failed, please try again",
      500
    );
    return next(error);
  }


  if (etudiants.length==0) {
    const error = new HttpError(
      "finding students failed, please try again",
      500
    );
    return next(error);
  }
  

  let enseignant; //les encadrant interne
  try {
    enseignant = await Enseignant.find({ _id: profs });
  } catch (er) {
    const error = new HttpError(
      "finding enseignants failed, please try again.",
      500
    );
    return next(error);
  }

  console.log(enseignant.length);
  console.log(enseignant);


  if (enseignant.length==0) {
    
    const error = new HttpError(
      "finding enseignants failed, please try again.",
      500
    );
    return next(error);
  }


   
  const newStage = new Stage({
    organismeAceuil: organisme,
    posteRepresentant: rep,
    encadrantExterne: encExterne,
    description: description,
    villeStage: ville,
    paysStage: pays,
    dateDebut: startDate,
    dateFin: finDate,

    // etudiant: userId,

    enseignants: enseignant,
    emailEncadrantExterne:emailEncadrantExterne
  });




  if(etudiants[0].stageId !=null){
    let stage;
    try {
      stage = await Stage.findById(etudiants[0].stageId)
    } catch (err) {
      const error = new HttpError(
        "finding stage failed, please try again",
        500
      );
      return next(error); 
    }

    if (stage==null) {
      const error = new HttpError(
        "finding stage failed, please try again",
        500
      );
      return next(error); 
    
    }

  
        try {

          stage.organismeAceuil= organisme
          stage.posteRepresentat= rep
          stage.encadrantExterne= encExterne
          stage.description= description
          stage.villeStage= ville
          stage.paysStage= pays
          stage.dateDebut= startDate
          stage.dateFin= finDate
          stage.etudiants= etudiants
          stage.enseignants= enseignant
          stage.emailEncadrantExterne=emailEncadrantExterne

         try {
          await stage.save();

          message="stage updated !"

        } catch (err) {
          const error = new HttpError(
            "Updating stage failed, please try again",
            500
          );
          return next(error); 
          
        }
         

          
          
        } catch (err) {
          const error = new HttpError(
            "Updating stage failed, please try again",
            500
          );
          return next(error); 
          
        }

  }

  else{

      
  const newDoc = new DocsAdmin({
    nom: "pfe",
    description : "pdf",
    url : req.file.path,
    type:"pfe"
  })



  
  try {

    const sess = await mongoose.startSession(); // open a session
    sess.startTransaction();
    newStage.etudiants = etudiants;
    // newStage.enseignants.push(enseignant)
    newStage.docs.push(newDoc);
  
    await newStage.save({ session: sess });
    newDoc.stageId = newStage;
    await newDoc.save();


    enseignant.map(async (e) => {
      e.stages.push(newStage);
      await e.save();
    });
  
    etudiants.map(async (e) => {
      e.stageId = newStage;
      e.tel = tel;
      e.email = email;
      
      await e.save();
    });
   
    await sess.commitTransaction();

  } catch (er) {
    const error = new HttpError(
      "submitting stage failed, please try again.",
      500
    );
    return next(error);
  }


  message="Le Stage est Enregistre ! "

  }


  res.status(201).json({ message: message });
};





// Valider une stage
const validerStage = async (req, res, next) => {
  const { stageId } = req.body;

  let stage;
  try {
    stage = await Stage.findById(stageId);
  } catch (er) {
    const error = new HttpError("finding stage failed, please try again.", 500);
    return next(error);
  }

  if (!stage) {
    const err = new HttpError("finding stage failed, please try again.", 401);
    return next(err);
  }

  if(stage.signatureDept=="1"){
    stage.signatureDept = 0;
    await stage.save();
    res.status(201).json({ message: "stage invalider" });
  
  }else{
    stage.signatureDept = 1;
    await stage.save();
    res.status(201).json({ message: "stage valider" });
  }




};

// delete stage
const deleteStage = async (req, res, next) => {
  const { stageId } = req.body;

  let etudiant, stage,enseignant,document;

  try {
    stage = await Stage.findById(stageId);
  } catch (error) {
    const er = new HttpError("finding stage failed, please try again.", 500);
    return next(er);
  }

  try {
    document = await DocsAdmin.findById(stage.docs[0])
    
  } catch (error) {
    const er = new HttpError("finding document failed, please try again.", 500);
    return next(er);
  }

  try {
    const sess = await mongoose.startSession(); // open a session
    sess.startTransaction();
           try {
            for (var i = 0; i < stage.etudiants.length; i++) {
              etudiant = await Etudiant.findById(stage.etudiants[i]);
              etudiant.stageId = null;
              await etudiant.save();
             }

             fs.unlink(document.url, err => {
              
            });


          } catch (error) {
            const err = new HttpError(
              "finding students failed, please try again.",
              401
            );
            return next(err);
          }



          //enseignants

         try {
          
        
              await Enseignant.updateMany( // select your doc in moongo
                {_id:stage.enseignants }, // your query, usually match by _id
                { $pull: { stages:stage._id  } }, // item(s) to match from array you want to pull/remove
                { multi: true } // set this to true if you want to remove multiple elements.
               )
              
            }
            
           catch (error) {
              const err = new HttpError(
                "finding teachers failed, please try again.",
                401
              );
              return next(err);
            }



            
          console.log("3")

           try {
            stage = await Stage.findByIdAndRemove(stageId)
          } catch (er) {
            const error = new HttpError(
              "finding stage failed, please try again.",
              500
            );
            return next(error);
          }

          console.log("4")


      sess.commitTransaction();


  } catch (er) {
    const error = new HttpError(
      "deleting stage failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "stage deleted" });

};



// get stage info

const getStageInfo = async (req, res, next) => {

  const stageId = req.params.pid;

  let etudiants, stage,docPfe,rapport;

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


  try {
    etudiants = await Etudiant.find({_id:stage.etudiants});
  } catch (error) {
    const er = new HttpError("finding stage failed, please try again.", 500);
    return next(er);
  }


  try {
    docPFE = await DocsAdmin.find({_id:stage.docs[0]});
  } catch (error) {
    const er = new HttpError("finding document failed, please try again.", 500);
    return next(er);
  }
  

  let rapports
  try {
   rapports = await DocsAdmin.find({stageId:stage._id,type:"rapport"});
    
  } catch (error) {
    
  }

  


  res.status(201).json({ stageInfo: stage,students:etudiants,docPFE:docPFE,rapport:rapports[rapports.length-1] });



}


// add keywords and description

const addKeywords = async (req, res, next) => {

  const {stageId,tags,desc }= req.body;
  console.log(req.body);
  let stage ;

  try {
    stage = await Stage.findById(stageId);
  } catch (error) {
    const er = new HttpError("finding stage failed, please try again.", 500);
    return next(er);
  }

  stage.tags = tags ;
  stage.desc = desc ;
  await stage.save();
  res.status(201).json({ msg:"Les keywords sont ajoutes" });
}



//////////////////////////////////

const getStagesValides = async (req, res, next) => {
  let stages;
  console.log("stage") ;
  try {
    
    stages = await Stage.find({}).populate('etudiants', "nom prenom cin")
    
    console.log(stages) ;
                                  
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Fetching stages failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ stages: stages });
};

//get stage by id 
const fullName = (person)=> {
  if(!person){
    return null ;
  }
  
    return person.nom + " " + person.prenom ;
  
}


///////


const getStage =  async (req, res, next)=>{
  const stageID = req.params.stageID;
  let stage ,etudiant,binome,encadrants,encadrant1,encadrant2,stageInfo= {};
  try {
      stage = await Stage.findById(stageID) ;
      etudiant = await Etudiant.findById(stage.etudiants[0]) ;
      binome = await Etudiant.findById(stage.etudiants[1]) ;
      encadrant1 = await Enseignant.findById(stage.enseignants[0]) ;
      encadrant2 = await Enseignant.findById(stage.enseignants[1]) ;
      stageInfo = {
        etudiant  : fullName(etudiant),
        binome : fullName(binome),
        encadrant1 : fullName(encadrant1),
        encadrant1Id : stage.enseignants[0],
        encadrant2 : fullName(encadrant2),
        encadrant2Id : stage.enseignants[1],
        entreprise : stage.organismeAceuil,
        dateDebut : stage.dateDebut,
        dateFin : stage.dateFin
      }


  }
  catch (err) {
    console.log(err)
    const error = new HttpError(
      "Fetching stage failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ stage: stageInfo });
}



// get enseiganant stages 
//---------------------------------------------------------------------------------------
const getEnseigantStages = async (req, res, next) => {

  const userId = req.params.userId;
  

  let userEns ;
  try {
     userEns = await User.findById(userId);
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Fetching stages failed, please try again later.",
      500
    );
    return next(error);
  }




 let enseignant;

  try {
    enseignant = await Enseignant.findById(userEns.enseignantId).populate('stages');
    
    
//    enseignant.stages.map(async(stage, index )=>{
     
//     //  stage.etudiants.map(async(etudiant,i)=>{
//        let s =  await Etudiant.find({ _id: stage.etudiants }, [
//             "nom",
//             "prenom",
//           ]);
//        console.log(s);
//     enseignant.stages[index].etudiants = s;
//     //console.log(enseignant.stages[index].etudiants[i]) 
// });

    for (var i = 0; i <  enseignant.stages.length; i++) {
      etudiants = await Etudiant.find({ _id: enseignant.stages[i].etudiants }, [
        "nom",
        "prenom",
      ]);
      enseignant.stages[i].etudiants = etudiants;
    }
}catch(err) {
    console.log(err)
    const error = new HttpError(
      "Fetching stages failed, please try again later.",
      500
    );
    return next(error);
  }
 
  //res.send(enseignant);
  res.status(201).json({ stages: enseignant.stages });

  // let docPFE;

  // try {
  //   for (var i = 0; i < stages.length; i++) {
  //     user = await User.find({ studentId: stages[i].etudiants }
  //     //    [
  //     //   // "nom",
  //     //   // "prenom",
  //     // ]
  //     );

  //   user.map((e,index)=>{
  //     stages[i].etudiants[index].cin = e._id;

  //   })

      
  //   }
  // } catch (er) {
  //   console.log(err)
  //   const error = new HttpError(
  //     "finding students failed, please try again",
  //     500
  //   );
  //   return next(error);
  // }


  // for (var i = 0; i < stages.length; i++) {
  //   docPFE = await  DocsAdmin.find({_id:stages[i].docs[0]}, [
  //     "url",
  //   ]);
  //   stages[i].docs = docPFE;
  // }


  //res.status(201).json({ stages: stages });
};









exports.newStage = newStage;
exports.getStages = getStages;
exports.validerStage = validerStage;
exports.deleteStage = deleteStage;
exports.getStageInfo = getStageInfo;
exports.getEnseigantStages = getEnseigantStages;
exports.addKeywords =addKeywords;

exports.getStage = getStage ;
exports.getStagesValides = getStagesValides ;