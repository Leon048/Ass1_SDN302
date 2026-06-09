const express = require('express');
const doctorController = require('../controllers/doctor.controller');

const router = express.Router();

// GET /api/doctor/appointments - Get doctor's appointments (requires auth - doctor)
router.get('/appointments', doctorController.getDoctorAppointments);

// PATCH /api/doctor/appointments/:id/status - Update appointment status (requires auth - doctor)
router.patch('/appointments/:id/status', doctorController.updateAppointmentStatus);

// POST /api/doctor/medical-records - Create medical record (requires auth - doctor)
router.post('/medical-records', doctorController.createMedicalRecord);

// GET /api/doctor/medical-records/:petId - Get pet's medical records (requires auth - doctor)
router.get('/medical-records/:petId', doctorController.getPetMedicalRecords);

// PATCH /api/doctor/medical-records/:id - Update medical record (requires auth - doctor)
router.patch('/medical-records/:id', doctorController.updateMedicalRecord);

// POST /api/doctor/vaccinations - Record vaccination (requires auth - doctor)
router.post('/vaccinations', doctorController.createVaccination);

// GET /api/doctor/vaccinations/:petId - Get pet's vaccination history (requires auth - doctor)
router.get('/vaccinations/:petId', doctorController.getPetVaccinations);

// GET /api/doctor/patients - Get list of doctor's patients (requires auth - doctor)
router.get('/patients', doctorController.getDoctorPatients);

module.exports = router;
