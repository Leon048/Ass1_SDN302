const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  breed: String,
  dob: Date,
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  weight: Number,
  microchip_id: String,
  avatar_url: String,
  notes: String,
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
petSchema.index({ owner_id: 1 });

module.exports = mongoose.model('Pet', petSchema);
