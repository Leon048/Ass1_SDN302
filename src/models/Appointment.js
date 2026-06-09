const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  scheduled_at: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'done', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  
  // Service snapshot at booking time
  service_snapshot: {
    name: String,
    price: Number,
    duration_minutes: Number
  },

  cancelled_reason: String,
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
appointmentSchema.index({ owner_id: 1, status: 1 });
appointmentSchema.index({ doctor_id: 1, scheduled_at: 1 });
appointmentSchema.index({ pet_id: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
