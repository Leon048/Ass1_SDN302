// routes/vaccinationRoutes.js

const express = require("express");
const router = express.Router();

const {
  createVaccination,
  getAllVaccinations,
  getVaccinationById,
  updateVaccination,
  deleteVaccination,
} = require("../controllers/vaccinationController");

router.post("/", createVaccination);
router.get("/", getAllVaccinations);
router.get("/:id", getVaccinationById);
router.put("/:id", updateVaccination);
router.delete("/:id", deleteVaccination);

module.exports = router;
