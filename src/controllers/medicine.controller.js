const Medicine = require('../models/Medicine');

// GET /api/medicines - Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ is_active: true })
      .select('-__v');
    
    if (medicines.length === 0) {
      return res.status(200).json({ message: 'Không có thuốc nào', data: [] });
    }
    
    return res.status(200).json({ 
      message: 'Lấy danh sách thuốc thành công', 
      data: medicines 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/medicines/:id - Get medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Không tìm thấy thuốc' });
    }
    
    return res.status(200).json({ 
      message: 'Lấy thông tin thuốc thành công', 
      data: medicine 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/medicines/category/:category - Get medicines by category
exports.getMedicinesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const medicines = await Medicine.find({ 
      category: category,
      is_active: true 
    });
    
    if (medicines.length === 0) {
      return res.status(200).json({ 
        message: `Không có thuốc nào trong danh mục ${category}`, 
        data: [] 
      });
    }
    
    return res.status(200).json({ 
      message: 'Lấy danh sách thuốc theo danh mục thành công', 
      data: medicines 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/medicines - Create new medicine (admin only)
exports.createMedicine = async (req, res) => {
  try {
    const { name, description, dosage, usage, side_effects, price, stock, manufacturer, expiry_date, category, image_url } = req.body;
    
    if (!name || !dosage || !price || !category) {
      return res.status(400).json({ message: 'name, dosage, price, và category là bắt buộc' });
    }
    
    const newMedicine = new Medicine({
      name,
      description,
      dosage,
      usage,
      side_effects,
      price,
      stock,
      manufacturer,
      expiry_date,
      category,
      image_url
    });
    
    await newMedicine.save();
    
    return res.status(201).json({ 
      message: 'Tạo thuốc thành công', 
      data: newMedicine 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/medicines/:id - Update medicine (admin only)
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { ...updateData, updated_at: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ message: 'Không tìm thấy thuốc' });
    }
    
    return res.status(200).json({ 
      message: 'Cập nhật thuốc thành công', 
      data: medicine 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/medicines/:id - Delete medicine (admin only - soft delete)
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { is_active: false, updated_at: Date.now() },
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ message: 'Không tìm thấy thuốc' });
    }
    
    return res.status(200).json({ 
      message: 'Xóa thuốc thành công', 
      data: medicine 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/medicines/:id/stock - Update medicine stock
exports.updateMedicineStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity) {
      return res.status(400).json({ message: 'quantity là bắt buộc' });
    }
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity }, updated_at: Date.now() },
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ message: 'Không tìm thấy thuốc' });
    }
    
    return res.status(200).json({ 
      message: 'Cập nhật kho thuốc thành công', 
      data: medicine 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
