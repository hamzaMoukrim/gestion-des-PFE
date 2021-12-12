const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const Schema =mongoose.Schema

const docSchema =new Schema(
   { 
     nom: {type:String,required:true },
     description : {type:String,required:true },
     url : {type:String,required:true },
     stageId:{  type: mongoose.Types.ObjectId,required:true , ref:'Stage' },
     type:{type:String,required:true }
}
)
docSchema.plugin(uniqueValidator);

module.exports = mongoose.model('DocAdmin',docSchema)