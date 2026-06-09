const User = require('../models/User');

// GET /api/homepage/services
exports.getServices = async (req, res) => {
  try {
    const Service = require('../models/Service');
    const services = await Service.find({ is_active: true });

    res.status(200).json({
      message: 'Services retrieved successfully',
      data: services
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving services', error: error.message });
  }
};

// GET /api/homepage/services/:id
exports.getServiceById = async (req, res) => {
  try {
    const Service = require('../models/Service');
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({
      message: 'Service retrieved successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving service', error: error.message });
  }
};

// GET /api/homepage/doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', is_active: true }).select('-password_hash -refresh_token');

    res.status(200).json({
      message: 'Doctors retrieved successfully',
      data: doctors
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving doctors', error: error.message });
  }
};

// GET /api/homepage/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password_hash -refresh_token');

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      message: 'Doctor retrieved successfully',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving doctor', error: error.message });
  }
};

// GET /api/homepage/available-slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({ message: 'doctor_id and date are required' });
    }

    const Appointment = require('../models/Appointment');
    const doctor = await User.findById(doctor_id);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get appointments for the doctor on this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor_id,
      scheduled_at: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    });

    // TODO: Calculate available slots based on doctor's working hours
    // This is a placeholder implementation
    const availableSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'
    ];

    res.status(200).json({
      message: 'Available slots retrieved successfully',
      data: availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving available slots', error: error.message });
  }
};
