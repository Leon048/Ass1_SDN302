const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Vaccination = require('../models/Vaccination');
const Pet = require('../models/Pet');

// GET /api/doctor/appointments - Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctor_id, date, status } = req.query;

    let query = {};

    if (doctor_id) {
      query.doctor_id = doctor_id;
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduled_at = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .sort({ scheduled_at: 1 });

    res.status(200).json({
      message: 'Doctor appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

// PATCH /api/doctor/appointments/:id/status - Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, doctor_id } = req.body;

    if (!status || !doctor_id) {
      return res.status(400).json({ message: 'Status and doctor_id are required' });
    }

    const validStatuses = ['confirmed', 'in_progress', 'done', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    if (status === 'confirmed' && !appointment.doctor_id) {
      appointment.doctor_id = doctor_id;
    }
    appointment.updated_at = Date.now();
    await appointment.save();

    res.status(200).json({
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};

// POST /api/doctor/medical-records - Create medical record
exports.createMedicalRecord = async (req, res) => {
  try {
    const { appointment_id, pet_id, doctor_id, diagnosis, treatment, symptoms, prescriptions, lab_results, attachments, follow_up_date } = req.body;

    if (!pet_id || !doctor_id) {
      return res.status(400).json({ message: 'pet_id and doctor_id are required' });
    }

    const record = new MedicalRecord({
      appointment_id,
      pet_id,
      doctor_id,
      diagnosis,
      treatment,
      symptoms,
      prescriptions,
      lab_results,
      attachments,
      follow_up_date
    });

    await record.save();

    res.status(201).json({
      message: 'Medical record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating medical record', error: error.message });
  }
};

// GET /api/doctor/medical-records/:petId - Get pet's medical records
exports.getPetMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ pet_id: req.params.petId })
      .populate('doctor_id')
      .populate('pet_id')
      .sort({ created_at: -1 });

    res.status(200).json({
      message: 'Medical records retrieved successfully',
      data: records
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving medical records', error: error.message });
  }
};

// PATCH /api/doctor/medical-records/:id - Update medical record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { diagnosis, treatment, symptoms, prescriptions, lab_results, attachments, follow_up_date } = req.body;

    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (diagnosis) record.diagnosis = diagnosis;
    if (treatment) record.treatment = treatment;
    if (symptoms) record.symptoms = symptoms;
    if (prescriptions) record.prescriptions = prescriptions;
    if (lab_results) record.lab_results = lab_results;
    if (attachments) record.attachments = attachments;
    if (follow_up_date) record.follow_up_date = follow_up_date;

    record.updated_at = Date.now();
    await record.save();

    res.status(200).json({
      message: 'Medical record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medical record', error: error.message });
  }
};

// POST /api/doctor/vaccinations - Record vaccination
exports.createVaccination = async (req, res) => {
  try {
    const { pet_id, doctor_id, vaccine_name, batch_number, administered_date, next_due_date, notes, appointment_id } = req.body;

    if (!pet_id || !doctor_id || !vaccine_name || !administered_date) {
      return res.status(400).json({ message: 'pet_id, doctor_id, vaccine_name, and administered_date are required' });
    }

    const vaccination = new Vaccination({
      pet_id,
      doctor_id,
      vaccine_name,
      batch_number,
      administered_date,
      next_due_date,
      notes,
      appointment_id
    });

    await vaccination.save();

    res.status(201).json({
      message: 'Vaccination recorded successfully',
      data: vaccination
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording vaccination', error: error.message });
  }
};

// GET /api/doctor/vaccinations/:petId - Get pet's vaccination history
exports.getPetVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.find({ pet_id: req.params.petId })
      .populate('doctor_id')
      .populate('pet_id')
      .sort({ administered_date: -1 });

    res.status(200).json({
      message: 'Vaccinations retrieved successfully',
      data: vaccinations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vaccinations', error: error.message });
  }
};

// GET /api/doctor/patients - Get doctor's patients
exports.getDoctorPatients = async (req, res) => {
  try {
    const { doctor_id } = req.query;

    if (!doctor_id) {
      return res.status(400).json({ message: 'doctor_id is required' });
    }

    const appointments = await Appointment.find({ doctor_id, status: { $ne: 'cancelled' } })
      .distinct('pet_id');

    const pets = await Pet.find({ _id: { $in: appointments } });

    res.status(200).json({
      message: 'Doctor patients retrieved successfully',
      data: pets
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patients', error: error.message });
  }
};
