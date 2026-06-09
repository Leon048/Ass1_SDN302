const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  vaccine_name: {
    type: String,
    required: true
  },
  batch_number: String,
  administered_date: {
    type: Date,
    required: true
  },
  next_due_date: Date,
  notes: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Indexes
vaccinationSchema.index({ pet_id: 1, administered_date: -1 });
vaccinationSchema.index({ next_due_date: 1 });

module.exports = mongoose.model('Vaccination', vaccinationSchema);
