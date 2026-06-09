const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');
const Service = require('../models/Service');

// POST /api/appointments - Book appointment
exports.createAppointment = async (req, res) => {
  try {
    const { pet_id, owner_id, service_id, scheduled_at, notes } = req.body;

    if (!pet_id || !owner_id || !service_id || !scheduled_at) {
      return res.status(400).json({ message: 'pet_id, owner_id, service_id, and scheduled_at are required' });
    }

    // Verify pet exists
    const pet = await Pet.findById(pet_id);
    if (!pet) {
      return res.status(403).json({ message: 'Pet not found' });
    }

    // Get service details
    const service = await Service.findById(service_id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create appointment
    const appointment = new Appointment({
      pet_id,
      owner_id,
      service_id,
      scheduled_at,
      notes,
      service_snapshot: {
        name: service.name,
        price: service.price,
        duration_minutes: service.duration_minutes
      }
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

// GET /api/appointments - Get appointments
exports.getAppointments = async (req, res) => {
  try {
    const { owner_id, status, date, pet_id } = req.query;

    let query = {};

    if (owner_id) {
      query.owner_id = owner_id;
    }

    if (status) {
      query.status = status;
    }

    if (pet_id) {
      query.pet_id = pet_id;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduled_at = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .populate('pet_id')
      .populate('service_id')
      .sort({ scheduled_at: -1 });

    res.status(200).json({
      message: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

// GET /api/appointments/:id - Get appointment by id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('pet_id')
      .populate('service_id')
      .populate('owner_id')
      .populate('doctor_id');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment retrieved successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointment', error: error.message });
  }
};

// PATCH /api/appointments/:id/cancel - Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { cancelled_reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if can cancel (not already done or cancelled)
    if (['done', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ message: `Cannot cancel appointment with status: ${appointment.status}` });
    }

    appointment.status = 'cancelled';
    appointment.cancelled_reason = cancelled_reason;
    appointment.updated_at = Date.now();
    await appointment.save();

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};
