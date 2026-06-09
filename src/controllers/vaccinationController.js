// controllers/vaccinationController.js

const Vaccination = require("../models/Vaccination");

// CREATE
const createVaccination = async (req, res) => {
  try {
    const vaccination = new Vaccination(req.body);
    const saved = await vaccination.save();

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create vaccination failed",
      error: error.message,
    });
  }
};

// GET ALL
const getAllVaccinations = async (req, res) => {
  try {
    const data = await Vaccination.find()
      .populate("pet_id")
      .populate("doctor_id")
      .populate("appointment_id");

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot get data from DB",
      error: error.message,
    });
  }
};
// GET BY ID
const getVaccinationById = async (req, res) => {
  try {
    const data = await Vaccination.findById(req.params.id)
      .populate("pet_id")
      .populate("doctor_id")
      .populate("appointment_id");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Vaccination not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// UPDATE
const updateVaccination = async (req, res) => {
  try {
    const updated = await Vaccination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Vaccination not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// DELETE
const deleteVaccination = async (req, res) => {
  try {
    const deleted = await Vaccination.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vaccination not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createVaccination,
  getAllVaccinations,
  getVaccinationById,
  updateVaccination,
  deleteVaccination,
};
