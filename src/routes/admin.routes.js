const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// USERS

router.get('/users/:id', adminController.getUserById);

router.get('/users', adminController.getAllUsers);

router.post('/users', adminController.createUser);

router.patch('/users/:id', adminController.updateUser);

router.patch('/users/:id/role', adminController.changeUserRole);

router.patch('/users/:id/status', adminController.toggleUserStatus);

// SERVICES

router.get('/services', adminController.getAllServices);

router.post('/services', adminController.createService);

router.patch('/services/:id', adminController.updateService);

router.delete('/services/:id', adminController.deleteService);

// APPOINTMENTS

router.get('/appointments', adminController.getAllAppointments);

router.get('/appointments/:id', adminController.getAppointmentById);

// INVOICES

router.get('/invoices', adminController.getAllInvoices);

router.get('/invoices/:id', adminController.getInvoiceById);

router.post('/invoices', adminController.createInvoice);

router.patch('/invoices/:id/status', adminController.updateInvoiceStatus);

// STATISTICS

router.get('/stats/overview', adminController.getOverviewStats);

router.get('/stats/appointments', adminController.getAppointmentStats);

router.get('/stats/revenue', adminController.getRevenueStats);

router.get('/stats/top-services', adminController.getTopServices);

router.get('/stats/doctors', adminController.getDoctorStats);

module.exports = router;
