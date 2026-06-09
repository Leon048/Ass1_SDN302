const express = require('express');
const appointmentController = require('../controllers/appointment.controller');

const router = express.Router();

// POST /api/appointments - Book appointment (requires auth - owner)
router.post('/', appointmentController.createAppointment);

// GET /api/appointments - Get user's appointments (requires auth - owner)
router.get('/', appointmentController.getAppointments);

// GET /api/appointments/:id - Get appointment details (requires auth - owner/doctor)
router.get('/:id', appointmentController.getAppointmentById);

// PATCH /api/appointments/:id/cancel - Cancel appointment (requires auth - owner)
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
