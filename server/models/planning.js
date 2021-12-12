const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const Schema =mongoose.Schema

const planningSchema =new Schema(
   { jour : {type:String,required:true },
    heureDebut : {type:String,required:true },
    heureFin : {type:String,required:true },
    stageId:{  type: mongoose.Types.ObjectId, ref:'Stage' },
    jury : [
        {
            enseignantID : {type: mongoose.Types.ObjectId , ref:'Enseignant'},
            role : String
        }
    ],
    salle :  {type:String,required:true }
    
}
)
planningSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Planning',planningSchema)