const HttpError = require("../models/Http-error");
const mongoose = require("mongoose");
const Filiere = require("../models/filiere");
const Etudiant = require("../models/etudiant");
const Option = require("../models/Option");
const filiere = require("../models/filiere");
//const filiere = require('../models/filiere')

const filieres = async (req, res, next) => {
  let filieres;
  try {
    filieres = await Filiere.find({}).populate("etudiants, options", "");
  } catch (err) {
    const error = new HttpError(
      "Fetching filieres failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ filieres: filieres });
};

// add omptions
const addOptions = async (req, res, next) => {
  const { filiereId, nom } = req.body;
  let options, filiere;

  if (nom == "" || filiereId == "") {
    const error = new HttpError(
      "adding option failed, please try again later.",
      500
    );
    return next(error);
  }

  try {
    filiere = await Filiere.findById(filiereId);
  } catch (err) {
    const error = new HttpError(
      "Fetching filieres failed, please try again later.",
      500
    );
    return next(error);
  }
  const option = new Option({
    nomOption: nom,
    filiere: filiere,
  });
  const sess = await mongoose.startSession(); // open a session
  sess.startTransaction();

  await option.save({ session: sess });
  filiere.options.push(option);
  await filiere.save();
  sess.commitTransaction();

  res.status(201).json({ msg: "option added " });
};

const studentsByfiliere = async (req, res, next) => {
  const filiereId = req.params.filiereId;
  let students;
  try {
    students = await Filiere.findById(filiereId).populate("etudiants", "");
  } catch (err) {
    const error = new HttpError(
      "Fetching students failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ students: students.etudiants });
};

const optionsByfiliere = async (req, res, next) => {
  const studentId = req.params.studentId;

  let s;
  try {
    s = await Etudiant.findById(studentId);
  } catch (err) {
    const error = new HttpError(
      "Fetching student failed, please try again later.",
      500
    );
    return next(error);
  }

  let options;
  try {
    options = await Filiere.findById(s.filiere).populate("options", "");
  } catch (err) {
    const error = new HttpError(
      "Fetching students failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ options: options });
};

exports.filieres = filieres;
exports.addOptions = addOptions;
exports.studentsByfiliere = studentsByfiliere;
exports.optionsByfiliere = optionsByfiliere;
