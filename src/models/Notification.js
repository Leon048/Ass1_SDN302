const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: String,
  type: {
    type: String,
    enum: ['appointment_confirmed', 'appointment_reminder', 'appointment_cancelled', 'invoice_created', 'system'],
    required: true
  },
  ref_id: mongoose.Schema.Types.ObjectId,
  ref_type: {
    type: String,
    enum: ['appointment', 'invoice']
  },
  is_read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Indexes
notificationSchema.index({ user_id: 1, is_read: 1, created_at: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
