const Pet = require('../models/Pet');

// GET /api/pets - Get all pets or filter by owner_id
exports.getPets = async (req, res) => {
  try {
    const { owner_id } = req.query;

    let query = { is_active: true };
    if (owner_id) query.owner_id = owner_id;

    const pets = await Pet.find(query);

    res.status(200).json({
      message: 'Pets retrieved successfully',
      data: pets
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pets', error: error.message });
  }
};

// POST /api/pets - Create new pet
exports.createPet = async (req, res) => {
  try {
    const { owner_id, name, breed, dob, gender, weight, microchip_id, avatar_url, notes } = req.body;

    if (!owner_id || !name) {
      return res.status(400).json({ message: 'owner_id and pet name are required' });
    }

    const pet = new Pet({
      owner_id,
      name,
      breed,
      dob,
      gender,
      weight,
      microchip_id,
      avatar_url,
      notes
    });

    await pet.save();

    res.status(201).json({
      message: 'Pet created successfully',
      data: pet
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating pet', error: error.message });
  }
};

// GET /api/pets/:id - Get pet by id
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({
      message: 'Pet retrieved successfully',
      data: pet
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pet', error: error.message });
  }
};

// PATCH /api/pets/:id - Update pet
exports.updatePet = async (req, res) => {
  try {
    const { name, breed, dob, gender, weight, microchip_id, avatar_url, notes } = req.body;

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (name) pet.name = name;
    if (breed) pet.breed = breed;
    if (dob) pet.dob = dob;
    if (gender) pet.gender = gender;
    if (weight) pet.weight = weight;
    if (microchip_id) pet.microchip_id = microchip_id;
    if (avatar_url) pet.avatar_url = avatar_url;
    if (notes) pet.notes = notes;

    pet.updated_at = Date.now();
    await pet.save();

    res.status(200).json({
      message: 'Pet updated successfully',
      data: pet
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating pet', error: error.message });
  }
};

// DELETE /api/pets/:id - Soft delete pet
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    pet.is_active = false;
    pet.updated_at = Date.now();
    await pet.save();

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pet', error: error.message });
  }
};

// GET /api/pets/:id/medical-records
exports.getPetMedicalRecords = async (req, res) => {
  try {
    const MedicalRecord = require('../models/MedicalRecord');
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const records = await MedicalRecord.find({ pet_id: req.params.id }).sort({ created_at: -1 });

    res.status(200).json({
      message: 'Medical records retrieved successfully',
      data: records
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving medical records', error: error.message });
  }
};

// GET /api/pets/:id/vaccinations
exports.getPetVaccinations = async (req, res) => {
  try {
    const Vaccination = require('../models/Vaccination');
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const vaccinations = await Vaccination.find({ pet_id: req.params.id }).sort({ administered_date: -1 });

    res.status(200).json({
      message: 'Vaccinations retrieved successfully',
      data: vaccinations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving vaccinations', error: error.message });
  }
};

// GET /api/pets/:id/appointments
exports.getPetAppointments = async (req, res) => {
  try {
    const Appointment = require('../models/Appointment');
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const appointments = await Appointment.find({ pet_id: req.params.id }).sort({ scheduled_at: -1 });

    res.status(200).json({
      message: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};
