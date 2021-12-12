const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const filiereSchema = new Schema({
  idFiliere: { type: String, required: true },
  nomFiliere: { type: String, required: true },
  etudiants: [{ type: mongoose.Types.ObjectId, ref: "Etudiant" }],

  options: [{ type: mongoose.Types.ObjectId, ref: "Option" }],

  chefDept: { type: mongoose.Types.ObjectId, ref: "Enseignant", default: null },
});
filiereSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Filiere", filiereSchema);
