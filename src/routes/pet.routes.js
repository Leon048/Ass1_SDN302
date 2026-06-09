const express = require('express');
const petController = require('../controllers/pet.controller');

const router = express.Router();

// GET /api/pets - Get list of user's pets (requires auth - owner)
router.get('/', petController.getPets);

// POST /api/pets - Create new pet (requires auth - owner)
router.post('/', petController.createPet);

// GET /api/pets/:id - Get pet details (requires auth - owner)
router.get('/:id', petController.getPetById);

// PATCH /api/pets/:id - Update pet info (requires auth - owner)
router.patch('/:id', petController.updatePet);

// DELETE /api/pets/:id - Delete pet (soft delete) (requires auth - owner)
router.delete('/:id', petController.deletePet);

// GET /api/pets/:id/medical-records - Get pet's medical records
router.get('/:id/medical-records', petController.getPetMedicalRecords);

// GET /api/pets/:id/vaccinations - Get pet's vaccination history
router.get('/:id/vaccinations', petController.getPetVaccinations);

// GET /api/pets/:id/appointments - Get pet's appointment history
router.get('/:id/appointments', petController.getPetAppointments);

module.exports = router;
