const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const Schema =mongoose.Schema

const enseignantSchema =new Schema(
   {
    nom : {type:String,required:true },
    prenom : {type:String,required:true },
    email : {type:String,required:true },
    filiere: {  type: mongoose.Types.ObjectId ,required:true, ref:'Filiere' } ,
    stages: [{  type: mongoose.Types.ObjectId ,required:true, ref:'Stage' }]


}
)
enseignantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Enseignant',enseignantSchema)