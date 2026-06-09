const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  dosage: {
    type: String,
    required: true
  },
  usage: String,
  side_effects: [String],
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  manufacturer: String,
  expiry_date: Date,
  category: {
    type: String,
    enum: ['antibiotic', 'vitamin', 'pain_relief', 'anti_inflammatory', 'other'],
    required: true
  },
  image_url: String,
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Indexes
medicineSchema.index({ name: 1 });
medicineSchema.index({ category: 1 });

module.exports = mongoose.model('Medicine', medicineSchema, 'medicines');
