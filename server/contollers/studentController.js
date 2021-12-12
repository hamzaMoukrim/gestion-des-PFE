const HttpError = require("../models/Http-error");
const mongoose = require("mongoose");
const Etudiant = require("../models/etudiant");
const User = require("../models/user");
const Filiere = require("../models/filiere");
const Option = require("../models/Option");
const Stage = require("../models/stage");
const Enseignant = require("../models/enseignant");
var randomstring = require("randomstring");
const { validationResult } = require("express-validator");

const getstudents = async (req, res, next) => {
  let students;
  try {
    students = await Etudiant.find({ stageId: null }, []);
  } catch (error) {
    const err = new HttpError("getting students failed", 500);

    return next(err);
  }

  res.json({ students: students });
};

const getUser = async (req, res, next) => {
  const id = req.params.id;

  let user;
  try {
    user = await User.findOne({ studentId: id });
  } catch (error) {
    const err = new HttpError("getting user Id failed", 500);

    return next(err);
  }

  if (user == null) {
    const err = new HttpError("getting user Id failed", 500);

    return next(err);
  }

  res.json({ userId: user._id });
};

const addStudent = async (req, res, next) => {
  const { etudiants, filiereId, optionId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs saisient invalide", 422));
  }

  let students = [];
  students = etudiants;

  if (students.length == 0) {
    const error = new HttpError("no student to add!", 500);
    return next(error);
  }

  let filiere;
  let option;

  try {
    filiere = await Filiere.findById(filiereId);
    option = await Option.findById(optionId);
  } catch (er) {
    const error = new HttpError(
      "finding filiere or Option failed, please try again.",
      500
    );
    return next(error);
  }

  if (filiere == null || option == null) {
    const error = new HttpError(
      "finding filiere or Option failed, please try again.",
      500
    );
    return next(error);
  }

  let u = [],
    st = [];

  let newStudents = [];

  students.map((s) => {
    st.push(s.cin);
    u.push(s.userName);
    const newStudent = new Etudiant({
      cne: s.cne,
      cin: s.cin,
      nom: s.nom,
      prenom: s.prenom,
      dateNaissance: s.dateNaissance,
      genre: s.genre,
      matricule: s.id,
      telephone: s.telephone,
      promotion: s.promotion,
      filiere: filiere,
      option: option,
      email: s.email,
      stageId: null,
    });

    const newUser = new User({
      userName: s.userName,
      // password: randomstring.generate(7),
      password: s.password,
      typeUser: "0",
    });
    newStudents.push({ student: newStudent, user: newUser });
  });

  let existingStudents, existingUsers;

  try {
    existingStudents = await Etudiant.find({ cin: st });
    existingUsers = await User.find({ userName: u });
  } catch (er) {
    const error = new HttpError("An error occured !", 500);
    return next(error);
  }

  if (existingStudents.length > 0 || existingUsers.length > 0) {
    const error = new HttpError("Certains eleves sont deja enregistres!", 500);
    return next(error);
  }

  try {
    for (let i = 0; i < newStudents.length; i++) {
      s = newStudents[i];

      await s.student.save();
      s.user.studentId = s.student;
      filiere.etudiants.push(s.student);
      await filiere.save();
      await s.user.save();
    }
  } catch (er) {
    console.log(er);
    const error = new HttpError(
      "Adding students failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "les etudiants sont ajoutes" });
};

const updateStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs invalide", 422));
  }

  const {
    optionId,
    studentId,
    userName,
    password,
    cne,
    cin,
    nom,
    prenom,
    dateNaissance,
    genre,
    matricule,
    telephone,
    promotion,
  } = req.body;

  let option;

  try {
    option = await Option.findById(optionId);
  } catch (er) {
    const error = new HttpError(
      "finding Option failed, please try again.",
      500
    );
    return next(error);
  }

  if (option == null) {
    const error = new HttpError(
      "finding Option failed, please try again.",
      500
    );
    return next(error);
  }

  let student;
  try {
    student = await Etudiant.findById(studentId);
  } catch (error) {
    const err = new HttpError("getting student failed", 500);

    return next(err);
  }

  if (student == null) {
    const err = new HttpError("getting student failed", 500);

    return next(err);
  }

  let user;
  try {
    user = await User.findOne({ studentId: studentId }).exec();
  } catch (error) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  if (user == null) {
    const err = new HttpError("getting user failed,please try again", 500);

    return next(err);
  }

  user.userName = userName;
  user.password = password;

  student.option = optionId;
  student.cne = cne;
  student.cin = cin;
  student.nom = nom;
  student.prenom = prenom;
  student.dateNaissance = dateNaissance;
  student.genre = genre;
  student.matricule = matricule;
  student.telephone = telephone;
  student.promotion = promotion;

  try {
    const sess = await mongoose.startSession(); // open a session
    sess.startTransaction();
    await student.save({ session: sess });
    await user.save();

    sess.commitTransaction();
  } catch (er) {
    const error = new HttpError(
      "update students failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({ message: "L'etudiant est modifie" });
};

// delete fucntion

const deleteStudent = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(new HttpError("l'etudiant Id invalide", 422));
  }

  const { studentId } = req.body;

  let filiere, student, stage;

  try {
    student = await Etudiant.findById(studentId);
  } catch (error) {
    const err = new HttpError("getting student failed", 500);

    return next(err);
  }

  if (student == null) {
    const err = new HttpError("getting student failed", 500);
  }

  try {
    filiere = await Filiere.findById(student.filiere);
  } catch (er) {
    const error = new HttpError(
      "finding Filiere failed, please try again.",
      500
    );
    return next(error);
  }

  if (filiere == null) {
    const error = new HttpError(
      "finding Filiere failed, please try again.",
      500
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ studentId: studentId });
  } catch (error) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  if (user == null) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  // try {

  const sess = await mongoose.startSession(); // open a session
  sess.startTransaction();

  await Filiere.updateOne(
    // select your doc in moongo
    { _id: filiere._id }, // your query, usually match by _id
    { $pull: { etudiants: studentId } }, // item(s) to match from array you want to pull/remove
    { multi: true } // set this to true if you want to remove multiple elements.
  );

  let s = await User.findByIdAndRemove(user._id);

  let e = await Etudiant.findByIdAndRemove(studentId);

  if (student.stageId != null) {
    try {
      stage = await Stage.findById(student.stageId);
    } catch (error) {
      const err = new HttpError("getting stage of the student failed", 500);

      return next(err);
    }

    await Stage.findByIdAndRemove(stage._id);

    await Enseignant.updateMany(
      // select your doc in moongo
      { _id: stage.enseignants }, // your query, usually match by _id
      { $pull: { stages: stage._id } }, // item(s) to match from array you want to pull/remove
      { multi: true } // set this to true if you want to remove multiple elements.
    );
  }

  sess.commitTransaction();

  res.json({ message: "L'etudiant est supprime" });
};

const getStudent = async (req, res, next) => {
  const studentId = req.params.pid;

  let student;

  try {
    student = await Etudiant.findById(studentId);
  } catch (error) {
    const err = new HttpError("getting student failed", 500);

    return next(err);
  }

  let user;

  try {
    user = await User.findOne({ studentId: studentId });
  } catch (error) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  res.json({ student: student, user: user });
};

exports.getstudents = getstudents;
exports.addStudent = addStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;
exports.getStudent = getStudent;
