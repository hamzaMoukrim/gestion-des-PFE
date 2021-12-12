const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const Schema =mongoose.Schema

const UserSchema =new Schema(
   {
     
     userName : {type:String,required:true,unique:true },
     password: {type:String,required:true },
     typeUser: {type:String,default: '0' },
     studentId:{  type: mongoose.Types.ObjectId , ref:'Etudiant' },
     enseignantId:{  type: mongoose.Types.ObjectId , ref:'Enseignant' }
 

}
)
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',UserSchema)