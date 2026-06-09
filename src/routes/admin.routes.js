const express = require("express");
const adminController = require("../controllers/admin.controller");

const router = express.Router();

// ===== USERS =====

// GET /api/admin/users - Get all users (requires auth - admin)
router.get("/users", adminController.getAllUsers);

// POST /api/admin/users - Create doctor or admin account (requires auth - admin)
router.post("/users", adminController.createUser);

// GET /api/admin/users/:id - Get user details (requires auth - admin)
router.get("/users/:id", adminController.getUserById);

// PATCH /api/admin/users/:id - Update user info (requires auth - admin)
router.patch("/users/:id", adminController.updateUser);

// PATCH /api/admin/users/:id/role - Change user role (requires auth - admin)
router.patch("/users/:id/role", adminController.changeUserRole);

// PATCH /api/admin/users/:id/status - Lock/unlock user account (requires auth - admin)
router.patch("/users/:id/status", adminController.toggleUserStatus);

// ===== SERVICES =====

// GET /api/admin/services - Get all services (requires auth - admin)
router.get("/services", adminController.getAllServices);

// POST /api/admin/services - Create service (requires auth - admin)
router.post("/services", adminController.createService);

// PATCH /api/admin/services/:id - Update service (requires auth - admin)
router.patch("/services/:id", adminController.updateService);

// DELETE /api/admin/services/:id - Delete service (soft delete) (requires auth - admin)
router.delete("/services/:id", adminController.deleteService);

// ===== APPOINTMENTS =====

// GET /api/admin/appointments - Get all appointments (requires auth - admin)
router.get("/appointments", adminController.getAllAppointments);

// GET /api/admin/appointments/:id - Get appointment details (requires auth - admin)
router.get("/appointments/:id", adminController.getAppointmentById);

// ===== INVOICES =====

// GET /api/admin/invoices - Get all invoices (requires auth - admin)
router.get("/invoices", adminController.getAllInvoices);

// GET /api/admin/invoices/:id - Get invoice details (requires auth - admin)
router.get("/invoices/:id", adminController.getInvoiceById);

// POST /api/admin/invoices - Create invoice (requires auth - admin)
router.post("/invoices", adminController.createInvoice);

// PATCH /api/admin/invoices/:id/status - Update invoice payment status (requires auth - admin)
router.patch("/invoices/:id/status", adminController.updateInvoiceStatus);

// ===== STATISTICS =====

// GET /api/admin/stats/overview - Get overview statistics (requires auth - admin)
router.get("/stats/overview", adminController.getOverviewStats);

// GET /api/admin/stats/appointments - Get appointment statistics (requires auth - admin)
router.get("/stats/appointments", adminController.getAppointmentStats);

// GET /api/admin/stats/revenue - Get revenue statistics (requires auth - admin)
router.get("/stats/revenue", adminController.getRevenueStats);

// GET /api/admin/stats/top-services - Get top services (requires auth - admin)
router.get("/stats/top-services", adminController.getTopServices);

// GET /api/admin/stats/doctors - Get doctor statistics (requires auth - admin)
router.get("/stats/doctors", adminController.getDoctorStats);

module.exports = router;
