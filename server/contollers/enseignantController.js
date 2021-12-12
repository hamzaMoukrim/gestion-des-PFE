const HttpError = require("../models/Http-error");
const mongoose = require("mongoose");
const Enseignant = require("../models/enseignant");
const Filiere = require("../models/filiere");
const User = require("../models/user");
const { ObjectId } = require("mongodb"); // or ObjectID
const { validationResult } = require("express-validator");

// all enseignants

const allEnseignants = async (req, res, next) => {
  let enseignants;

  try {
    enseignants = await Enseignant.find({}); //get all the users without password
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ enseignants: enseignants });
};

const enseignants = async (req, res, next) => {
  let enseignants;
  try {
    enseignants = await Enseignant.find({ filiere: req.params.filiereId }); //get all the users without password
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ enseignants: enseignants });
};

const addEnseignants = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs invalide", 422));
  }

  const { enseignants, filiereId } = req.body;

  let e = [];
  e = enseignants;

  if (e.length == 0) {
    const error = new HttpError("no enseignant to add!", 500);
    return next(error);
  }

  let filiere;

  try {
    filiere = await Filiere.findById(filiereId);
  } catch (er) {
    const error = new HttpError(
      "finding filiere or Option failed, please try again.",
      500
    );
    return next(error);
  }

  if (filiere == null) {
    const error = new HttpError(
      "finding filiere failed, please try again.",
      500
    );
    return next(error);
  }

  let u = [],
    st = [];

  let newEnseignants = [];

  e.map((s) => {
    st.push(s.email);
    u.push(s.userName);

    const newEnseignant = new Enseignant({
      nom: s.nom,
      prenom: s.prenom,
      filiere: filiere,
      email: s.email,
    });

    const newUser = new User({
      userName: s.userName,
      // password: randomstring.generate(7),
      password: s.password,
      typeUser: "1",
    });
    newEnseignants.push({ enseignant: newEnseignant, user: newUser });
  });

  let existingens, existingUsers;

  try {
    existingens = await Enseignant.find({ email: st });
    existingUsers = await User.find({ userName: u });
  } catch (er) {
    const error = new HttpError("An error occured !", 500);
    return next(error);
  }

  if (existingens.length > 0 || existingUsers.length > 0) {
    const error = new HttpError(
      "Certains Enseignants sont deja enregistres !",
      500
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession(); // open a session
    sess.startTransaction();
    newEnseignants.map(async (s) => {
      await s.enseignant.save({ session: sess });
      s.user.enseignantId = s.enseignant;
      await s.user.save();
    });

    sess.commitTransaction();
  } catch (er) {
    const error = new HttpError(
      "Adding enseignants failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ message: "les enseignants sont ajoutes" });
};

// update enseignant

const updateEnseignant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs saisient invalide", 422));
  }

  const { enseignantId, userName, password, prenom, nom, filiere, email } =
    req.body;

  let enseignant;
  try {
    enseignant = await Enseignant.findById(enseignantId);
  } catch (error) {
    const err = new HttpError("getting enseignant failed", 500);

    return next(err);
  }

  if (enseignant == null) {
    const err = new HttpError("getting enseignant failed", 500);

    return next(err);
  }

  let user;
  try {
    user = await User.findOne({ enseignantId: enseignantId }).exec();
  } catch (error) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  if (user == null) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  user.userName = userName;
  user.password = password;

  enseignant.nom = nom;
  enseignant.prenom = prenom;
  enseignant.filiere = filiere;
  enseignant.email = email;

  try {
    const sess = await mongoose.startSession(); // open a session
    sess.startTransaction();
    await enseignant.save({ session: sess });
    await user.save();

    sess.commitTransaction();
  } catch (er) {
    const error = new HttpError(
      "update Enseignant failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({ message: "L'enseignant est modifie" });
};

// delete enseignant

const deleteEnseignant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs saisient invalide", 422));
  }

  const { enseignantId } = req.body;

  let enseignant;

  try {
    enseignant = await Enseignant.findById(enseignantId);
  } catch (error) {
    const err = new HttpError("getting enseignant failed", 500);

    return next(err);
  }

  if (enseignant == null) {
    const err = new HttpError("getting enseignant failed", 500);

    return next(err);
  }

  let user;
  try {
    user = await User.findOne({ enseignantId: enseignantId });
  } catch (error) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  if (user == null) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  try {
    const sess = await mongoose.startSession(); // open a session
    sess.startTransaction();
    let s = await User.findByIdAndRemove(user._id);
    console.log(enseignant);
    let e = await Enseignant.findByIdAndRemove(enseignant._id);
    sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("deleting student failed", 500);

    return next(err);
  }

  res.json({ message: "L'enseignant est supprime" });
};

//get student

const getEnseignant = async (req, res, next) => {
  const enseignantId = req.params.pid;

  let enseignant;

  try {
    enseignant = await Enseignant.findById(enseignantId);
  } catch (error) {
    const err = new HttpError("getting student failed", 500);

    return next(err);
  }

  let user;
  try {
    user = await User.findOne({ enseignantId: enseignant._id });
  } catch (error) {
    const err = new HttpError("getting user failed", 500);

    return next(err);
  }

  res.json({ enseignant: enseignant, user: user });
};

//update chef departement

const updateChefdept = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs saisient invalide", 422));
  }

  const { enseignantId, filiereId } = req.body;

  let filiere, enseignant, chef;

  try {
    enseignant = await Enseignant.findById(enseignantId);
  } catch (error) {
    const err = new HttpError("getting enseignant failed", 500);

    return next(err);
  }

  if (enseignant == null) {
    const err = new HttpError("getting enseignant failed", 500);

    return next(err);
  }

  try {
    filiere = await Filiere.findById(filiereId);
  } catch (error) {
    const err = new HttpError("getting filiere failed", 500);

    return next(err);
  }

  if (filiere == null) {
    const err = new HttpError("getting filiere failed", 500);

    return next(err);
  }

  if (filiere.chefDept == null) {
    let user;
    try {
      user = await User.findOne({ enseignantId: enseignantId }).exec();
    } catch (error) {
      const err = new HttpError("getting user failed", 500);

      return next(err);
    }

    if (user == null) {
      const err = new HttpError("getting user failed", 500);

      return next(err);
    }

    user.typeUser = "2";

    try {
      filiere.etudiants = filiere.etudiants;

      const sess = await mongoose.startSession(); // open a session
      sess.startTransaction();
      filiere.chefDept = enseignant._id;
      console.log(filiere);
      await filiere.save();

      await user.save();

      sess.commitTransaction();
    } catch (er) {
      const error = new HttpError(
        "adding chef of department failed, please try again.",
        500
      );
      return next(error);
    }
  } else if (enseignantId !== filiere.chefDept) {
    try {
      chef = await Enseignant.findById(filiere.chefDept);
    } catch (error) {
      const err = new HttpError("getting enseignant failed", 500);

      return next(err);
    }

    let user, user2;

    try {
      user2 = await User.findOne({ enseignantId: ObjectId(filiere.chefDept) });
    } catch (error) {
      const err = new HttpError("getting user failed", 500);

      return next(err);
    }

    try {
      user = await User.findOne({ enseignantId: ObjectId(enseignantId) });
    } catch (error) {
      const err = new HttpError("getting user failed", 500);

      return next(err);
    }

    if (user == null || user2 == null) {
      const err = new HttpError("getting users failed", 500);

      return next(err);
    }

    user.typeUser = "2";
    user2.typeUser = "1";

    filiere.chefDept = enseignantId;
    filiere.etudiants = filiere.etudiants;

    try {
      const sess = await mongoose.startSession(); // open a session
      sess.startTransaction();

      await filiere.save({ session: sess });
      await user.save();
      await user2.save();

      sess.commitTransaction();
    } catch (er) {
      const error = new HttpError(
        "adding chef of department failed, please try again.",
        500
      );
      return next(error);
    }
  }

  res.json({ message: "Le chef de departement est modifie" });
};

// get chef dept

const getcheftDepts = async (req, res, next) => {
  let filieres;

  try {
    filieres = await Filiere.find({}, "-options -etudiants").populate(
      "chefDept",
      "_id nom prenom email"
    );
  } catch (error) {
    const err = new HttpError("getting filieres failed", 500);

    return next(err);
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ filieres: filieres });
};

exports.enseignants = enseignants;
exports.addEnseignants = addEnseignants;
exports.updateEnseignant = updateEnseignant;
exports.deleteEnseignant = deleteEnseignant;
exports.getEnseignant = getEnseignant;
exports.updateChefdept = updateChefdept;
exports.getcheftDepts = getcheftDepts;

exports.allEnseignants = allEnseignants;
