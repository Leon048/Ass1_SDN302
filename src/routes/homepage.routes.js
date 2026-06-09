const express = require('express');
const homepageController = require('../controllers/homepage.controller');

const router = express.Router();

// GET /api/homepage/services - Get list of active services
router.get('/services', homepageController.getServices);

// GET /api/homepage/services/:id - Get service details
router.get('/services/:id', homepageController.getServiceById);

// GET /api/homepage/doctors - Get list of doctors
router.get('/doctors', homepageController.getDoctors);

// GET /api/homepage/doctors/:id - Get doctor details
router.get('/doctors/:id', homepageController.getDoctorById);

// GET /api/homepage/available-slots - Get available time slots
router.get('/available-slots', homepageController.getAvailableSlots);

module.exports = router;
