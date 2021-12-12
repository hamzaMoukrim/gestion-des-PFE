const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const Schema =mongoose.Schema

const EtudiantSchema =new Schema(
   {
    cne : {type:String,required:true },
    cin : {type:String,required:true },
    nom : {type:String,required:true },
    tel : {type:String },
    email : {type:String },
    prenom : {type:String,required:true },
    dateNaissance : {type:String,required:true },
    genre : {type:String,required:true },
    matricule : {type:String,required:true },
    telephone : {type:String,required:true },
    filiere: {  type: mongoose.Types.ObjectId ,required:true, ref:'Filiere' } ,
    option: {  type: mongoose.Types.ObjectId ,required:true, ref:'Option' } ,
    promotion: {type:String,required:true },
    image: {type:String },
    stageId:{  type: mongoose.Types.ObjectId, ref:'Stage' }


}
)
EtudiantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Etudiant',EtudiantSchema)