const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  pet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  diagnosis: String,
  treatment: String,
  symptoms: [String],
  
  prescriptions: [
    {
      medicine_name: String,
      dosage: String,
      duration_days: Number,
      notes: String
    }
  ],

  lab_results: [
    {
      test_name: String,
      result: String,
      unit: String,
      reference_range: String,
      is_abnormal: Boolean
    }
  ],

  attachments: [String],
  follow_up_date: Date,
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
medicalRecordSchema.index({ pet_id: 1, created_at: -1 });
medicalRecordSchema.index({ doctor_id: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
