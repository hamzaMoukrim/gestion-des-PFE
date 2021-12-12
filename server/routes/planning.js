const express = require("express");
const planningController = require("../contollers/planningController");
const router = express.Router();
const { check } = require("express-validator");
const planning = require("../models/planning");

router.post(
  "/newplanning",
  [
    check("jour").not().isEmpty(),
    check("heureDebut").not().isEmpty(),
    check("heureFin").not().isEmpty(),
    check("salle").not().isEmpty(),
  ],
  planningController.newplanning
);

router.get("", planningController.getPlannings);

router.get("/:stageId", planningController.getStudentPlanning);

module.exports = router;
