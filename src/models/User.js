const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'owner'],
    required: true
  },
  full_name: String,
  phone: String,
  avatar_url: String,
  is_active: {
    type: Boolean,
    default: true
  },

  owner_profile: {
    address: String,
    emergency_contact: String
  },

  doctor_profile: {
    license_number: String,
    specialization: String,
    bio: String,
    working_hours: {
      mon: { start: String, end: String },
      tue: { start: String, end: String },
      wed: { start: String, end: String },
      thu: { start: String, end: String },
      fri: { start: String, end: String },
      sat: { start: String, end: String },
      sun: { start: String, end: String }
    }
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
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
