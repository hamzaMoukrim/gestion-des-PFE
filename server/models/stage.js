const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const Schema =mongoose.Schema

const stageSchema =new Schema(
   { dateDebut : {type:String,required:true },
    dateFin : {type:String,required:true },
    encadrantExterne : {type:String,required:true },
    organismeAceuil : {type:String,required:true },
    paysStage : {type:String,required:true },
    posteRepresentant: {type:String,required:true },
     description : {type:String,required:true },
     villeStage: {type:String,required:true },
     signatureDept : {type:String,default:'0' },
     signatureDirect : {type:String,default:'0' },
     enseignants:[{  type: mongoose.Types.ObjectId , ref:'Enseignant' }],
     etudiants:[{  type: mongoose.Types.ObjectId, ref:'Etudiant' }],
     docs:[{  type: mongoose.Types.ObjectId, ref:'DocAdmin' }],
     emailEncadrantExterne : {type:String,required:true },
     tags : [{type:String }],
     desc: {type:String,required:false }
}
)
stageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Stage',stageSchema)