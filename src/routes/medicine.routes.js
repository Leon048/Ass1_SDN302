const express = require('express');
const medicineController = require('../controllers/medicine.controller');

const router = express.Router();

// GET /api/medicines - Get all medicines
router.get('/', medicineController.getAllMedicines);

// GET /api/medicines/:id - Get medicine by ID
router.get('/:id', medicineController.getMedicineById);

// GET /api/medicines/category/:category - Get medicines by category
router.get('/category/:category', medicineController.getMedicinesByCategory);

// POST /api/medicines - Create new medicine (admin only)
router.post('/', medicineController.createMedicine);

// PATCH /api/medicines/:id - Update medicine (admin only)
router.patch('/:id', medicineController.updateMedicine);

// DELETE /api/medicines/:id - Delete medicine (admin only)
router.delete('/:id', medicineController.deleteMedicine);

// PATCH /api/medicines/:id/stock - Update medicine stock
router.patch('/:id/stock', medicineController.updateMedicineStock);

module.exports = router;
