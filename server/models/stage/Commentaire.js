const mongoose = require ("mongoose");

const Schema = mongoose.Schema;

const enseignantCommentaire = new Schema(
 { commentaire : {type : String , required : true}
}
  );

  module.exports = mongoose.model("Commentaire", enseignantCommentaire);