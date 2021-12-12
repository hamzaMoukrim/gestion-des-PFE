const HttpError = require("../models/Http-error");
const Planning = require("../models/planning");
const Stage = require("../models/stage.js");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Enseignant = require("../models/enseignant");
const { enseignants } = require("./enseignantController");
const Etudiant = require("../models/etudiant");

const getStudentPlanning = async (req, res, next) => {
  let stageID = req.params.stageId;

  let plannings,
    etudiants = [];
  let data = [];

  try {
    plannings = await Planning.find({ stageId: `${stageID}` }).populate(
      "stageId",
      "etudiants enseignants description"
    );

    if (plannings.length >= 1) {
      for (var i = 0; i < plannings.length; i++) {
        let ens = [];
        let membres = [];

        for (let index = 0; index < plannings[i].jury.length; index++) {
          ens[index] = await Enseignant.findById(
            plannings[i].jury[index].enseignantID
          );

          membres.push({
            enseignant: ens[index].nom + " " + ens[index].prenom,
            role: plannings[i].jury[index].role,
          });
        }

        // plannings[i].jury.map(async (j, index) => {
        //   console.log("1");
        //   ens[index] = await Enseignant.findById(plannings[i].jury[index].enseignantID);

        //   membres.push({
        //     enseignant: ens[index].nom + " " + ens[index].prenom,
        //     role: jury.role,
        //   });
        // });

        // enseignant1 = await Enseignant.findById(
        //   plannings[i].jury[0].enseignantID
        // );
        // enseignant2 = await Enseignant.findById(
        //   plannings[i].jury[1].enseignantID
        // );

        // ens.map(e=>{
        //   membres.push({enseignant : e.nom + " " + e.prenom})
        // })

        // membres = [
        //   {
        //     enseignant1: enseignant1.nom + " " + enseignant1.prenom,
        //     role: plannings[i].jury[0].role,
        //   },
        //   {
        //     enseignant2: enseignant2.nom + " " + enseignant2.prenom,
        //     role: plannings[i].jury[1].role,
        //   },
        //   { encadrantInterne: plannings[i].stageId.enseignants },

        // ];

        etudiant1 = await Etudiant.findById(plannings[i].stageId.etudiants[0]);
        if (plannings[i].stageId.etudiants.length > 1) {
          etudiant2 = await Etudiant.findById(
            plannings[i].stageId.etudiants[1]
          );
        } else etudiant2 = null;

        etudiants = {
          etudiant1: etudiant1 ? etudiant1.nom + " " + etudiant1.prenom : "",
          etudiant2: etudiant2 ? etudiant2.nom + " " + etudiant2.prenom : "",
        };
        var encadrant = await Enseignant.findById(
          plannings[i].stageId.enseignants
        );
        // membres = [
        //   {
        //     enseignant1: enseignant1
        //       ? enseignant1.nom + " " + enseignant1.prenom
        //       : "",
        //     role: plannings[i].jury[0].role,
        //   },
        //   {
        //     enseignant2: enseignant2
        //       ? enseignant2.nom + " " + enseignant2.prenom
        //       : "",
        //     role: plannings[i].jury[1].role,
        //   },
        //   {
        //     encadrantInterne: encadrant
        //       ? encadrant.nom + " " + encadrant.prenom
        //       : "",
        //   },
        // ];
        data.push({
          planningID: plannings[i]._id,
          etudiants: etudiants,
          sujet: plannings[i].stageId.description,
          jury: membres,
          encadrantInterne: plannings[i].stageId.enseignants,
          salle: plannings[i].salle,
          date: plannings[i].jour,
          heureDebut: plannings[i].heureDebut,
          heureFin: plannings[i].heureFin,
        });
      }
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Fetching stages failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ plannings: data });
};

const getPlannings = async (req, res, next) => {
  let plannings,
    etudiants = [];
  let data = [];
  let enseignant1, enseignant2, membres;
  try {
    plannings = await Planning.find({}).populate(
      "stageId",
      "etudiants enseignants description"
    );
    if (plannings.length >= 1) {
      for (var i = 0; i < plannings.length; i++) {
        let ens = [];
        let membres = [];

        for (let index = 0; index < plannings[i].jury.length; index++) {
          ens[index] = await Enseignant.findById(
            plannings[i].jury[index].enseignantID
          );

          membres.push({
            enseignant: ens[index].nom + " " + ens[index].prenom,
            role: plannings[i].jury[index].role,
          });
        }

        // enseignant1 = await Enseignant.findById(
        //   plannings[i].jury[0].enseignantID
        // );
        // enseignant2 = await Enseignant.findById(
        //   plannings[i].jury[1].enseignantID
        // );

        etudiant1 = await Etudiant.findById(plannings[i].stageId.etudiants[0]);
        if (plannings[i].stageId.etudiants.length > 1) {
          etudiant2 = await Etudiant.findById(
            //plannings[i].jury[1].enseignantID
            plannings[i].stageId.etudiants[1]
          );
        } else etudiant2 = null;

        etudiants = {
          etudiant1: etudiant1 ? etudiant1.nom + " " + etudiant1.prenom : "",
          etudiant2: etudiant2 ? etudiant2.nom + " " + etudiant2.prenom : "",
        };
        var encadrant = await Enseignant.findById(
          plannings[i].stageId.enseignants
        );
        // membres = [
        //   {
        //     enseignant1: enseignant1
        //       ? enseignant1.nom + " " + enseignant1.prenom
        //       : "",
        //     role: plannings[i].jury[0].role,
        //     enseignantID: plannings[i].jury[0].enseignantID,
        //   },
        //   {
        //     enseignant2: enseignant2
        //       ? enseignant2.nom + " " + enseignant2.prenom
        //       : "",
        //     role: plannings[i].jury[1].role,
        //     enseignantID: plannings[i].jury[1].enseignantID,
        //   },
        //   {
        //     encadrantInterne: encadrant
        //       ? encadrant.nom + " " + encadrant.prenom
        //       : "",
        //     enseignantID: encadrant ? encadrant._id : "",
        //   },
        // ];

        data.push({
          planningID: plannings[i]._id,
          etudiants: etudiants,
          sujet: plannings[i].stageId.description,
          jury: membres,
          encadrantInterne: plannings[i].stageId.enseignants,
          salle: plannings[i].salle,
          date: plannings[i].jour,
          heureDebut: plannings[i].heureDebut,
          heureFin: plannings[i].heureFin,
        });
      }
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Fetching stages failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ plannings: data });
};

const newplanning = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("certains champs invalide", 422));
  }

  const data = req.body;

  let planning;
  try {
    planning = await Planning.findById(data.planningID);
    planning.jour = data.jour;
    planning.heureDebut = data.heureDebut;
    planning.heureFin = data.heureFin;
    planning.salle = data.salle;
  } catch (err2) {
    const err = new HttpError("getting planning failed", 500);
    return next(err);
  }

  if (planning == null) {
    const err = new HttpError("getting planning failed", 500);
    return next(err);
  }

  try {
    await planning.save();
  } catch (err2) {
    const err = new HttpError("An error occured", 500);
    return next(err);
  }
  message = "Le planning est modifie ! ";
};

exports.newplanning = newplanning;
exports.getPlannings = getPlannings;
exports.getStudentPlanning = getStudentPlanning;
