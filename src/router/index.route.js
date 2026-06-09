const express = require('express');
const homepageRoutes = require('../routes/homepage.routes');
const petRoutes = require('../routes/pet.routes');
const appointmentRoutes = require('../routes/appointment.routes');
const doctorRoutes = require('../routes/doctor.routes');
const adminRoutes = require('../routes/admin.routes');
const notificationRoutes = require('../routes/notification.routes');

const router = express.Router();

// Public routes
router.use('/homepage', homepageRoutes);
router.use('/pets', petRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctor', doctorRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;