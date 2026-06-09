const User = require("../models/User");
const Service = require("../models/Service");
const Appointment = require("../models/Appointment");
const Invoice = require("../models/Invoice");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const { role, is_active } = req.query;

    let query = {};
    if (role) query.role = role;
    if (is_active !== undefined) query.is_active = is_active === "true";

    const users = await User.find(query).select(
      "-password_hash -refresh_token",
    );

    res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      role,
      owner_profile,
      doctor_profile,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "email, password and role are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password_hash: hashedPassword,
      full_name,
      phone,
      role,
    };

    if (role === "owner") {
      userData.owner_profile = owner_profile;
    } else if (role === "doctor") {
      userData.doctor_profile = doctor_profile;
    }

    const user = new User(userData);

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID nhận được:", id);
    console.log("Độ dài:", id?.length);

    const user = await User.findById(id).select("-password_hash ");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

// PATCH /api/admin/users/:id - Update user
exports.updateUser = async (req, res) => {
  try {
    const { full_name, phone, avatar_url, doctor_profile, owner_profile } =
      req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (avatar_url) user.avatar_url = avatar_url;
    if (doctor_profile && user.role === "doctor")
      user.doctor_profile = doctor_profile;
    if (owner_profile && user.role === "owner")
      user.owner_profile = owner_profile;

    user.updated_at = Date.now();
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// PATCH /api/admin/users/:id/role - Change user role
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["admin", "doctor", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    user.updated_at = Date.now();
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user role", error: error.message });
  }
};

// PATCH /api/admin/users/:id/status - Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({ message: "is_active is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_active, updated_at: Date.now() },
      { new: true },
    ).select("-password_hash -refresh_token");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${is_active ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling user status", error: error.message });
  }
};

// ===== SERVICES =====

// GET /api/admin/services - Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();

    res.status(200).json({
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving services", error: error.message });
  }
};

// POST /api/admin/services - Create service
exports.createService = async (req, res) => {
  try {
    const { name, description, price, duration_minutes, category, image_url } =
      req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "name, price, and category are required" });
    }

    const service = new Service({
      name,
      description,
      price,
      duration_minutes,
      category,
      image_url,
    });

    await service.save();

    res.status(201).json({
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
};

// PATCH /api/admin/services/:id - Update service
exports.updateService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration_minutes,
      category,
      image_url,
      is_active,
    } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (name) service.name = name;
    if (description) service.description = description;
    if (price) service.price = price;
    if (duration_minutes) service.duration_minutes = duration_minutes;
    if (category) service.category = category;
    if (image_url) service.image_url = image_url;
    if (is_active !== undefined) service.is_active = is_active;

    service.updated_at = Date.now();
    await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

// DELETE /api/admin/services/:id - Soft delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.is_active = false;
    service.updated_at = Date.now();
    await service.save();

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};

// ===== APPOINTMENTS =====

// GET /api/admin/appointments - Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctor_id } = req.query;

    let query = {};
    if (status) query.status = status;
    if (doctor_id) query.doctor_id = doctor_id;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.scheduled_at = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .populate("pet_id")
      .populate("owner_id")
      .populate("doctor_id")
      .populate("service_id");

    res.status(200).json({
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving appointments", error: error.message });
  }
};

// GET /api/admin/appointments/:id - Get appointment by id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("pet_id")
      .populate("owner_id")
      .populate("doctor_id")
      .populate("service_id");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment retrieved successfully",
      data: appointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving appointment", error: error.message });
  }
};

// ===== INVOICES =====

// GET /api/admin/invoices - Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const { status, from, to } = req.query;

    let query = {};
    if (status) query.status = status;
    if (from || to) {
      query.created_at = {};
      if (from) query.created_at.$gte = new Date(from);
      if (to) query.created_at.$lte = new Date(to);
    }

    const invoices = await Invoice.find(query)
      .populate("appointment_id")
      .populate("owner_id")
      .sort({ created_at: -1 });

    res.status(200).json({
      message: "Invoices retrieved successfully",
      data: invoices,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving invoices", error: error.message });
  }
};

// GET /api/admin/invoices/:id - Get invoice by id
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("appointment_id")
      .populate("owner_id");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({
      message: "Invoice retrieved successfully",
      data: invoice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving invoice", error: error.message });
  }
};

// POST /api/admin/invoices - Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const { appointment_id, amount, discount } = req.body;

    if (!appointment_id || !amount) {
      return res
        .status(400)
        .json({ message: "appointment_id and amount are required" });
    }

    const appointment = await Appointment.findById(appointment_id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const finalAmount = amount - (discount || 0);

    const invoice = new Invoice({
      appointment_id,
      owner_id: appointment.owner_id,
      amount,
      discount: discount || 0,
      final_amount: finalAmount,
    });

    await invoice.save();

    res.status(201).json({
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating invoice", error: error.message });
  }
};

// PATCH /api/admin/invoices/:id/status - Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status, payment_method } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    if (!["unpaid", "paid", "refunded"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = status;
    if (status === "paid") {
      invoice.paid_at = Date.now();
      if (payment_method) invoice.payment_method = payment_method;
    }
    invoice.updated_at = Date.now();
    await invoice.save();

    res.status(200).json({
      message: "Invoice status updated successfully",
      data: invoice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating invoice status", error: error.message });
  }
};

// ===== STATISTICS =====

// GET /api/admin/stats/overview - Get overview stats
exports.getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPets = require("../models/Pet").countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          status: "paid",
          created_at: { $gte: currentMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$final_amount" },
        },
      },
    ]);

    res.status(200).json({
      message: "Overview statistics retrieved successfully",
      data: {
        totalUsers,
        totalPets: await totalPets,
        totalAppointments,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving statistics", error: error.message });
  }
};

// GET /api/admin/stats/appointments - Get appointment stats
exports.getAppointmentStats = async (req, res) => {
  try {
    const { period } = req.query; // day, week, month

    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: {
            status: "$status",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$scheduled_at" },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": -1 },
      },
    ]);

    res.status(200).json({
      message: "Appointment statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointment statistics",
      error: error.message,
    });
  }
};

// GET /api/admin/stats/revenue - Get revenue stats
exports.getRevenueStats = async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = { status: "paid" };
    if (from || to) {
      query.created_at = {};
      if (from) query.created_at.$gte = new Date(from);
      if (to) query.created_at.$lte = new Date(to);
    }

    const revenue = await Invoice.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          total: { $sum: "$final_amount" },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      message: "Revenue statistics retrieved successfully",
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving revenue statistics",
      error: error.message,
    });
  }
};

// GET /api/admin/stats/top-services - Get top services
exports.getTopServices = async (req, res) => {
  try {
    const topServices = await Appointment.aggregate([
      {
        $group: {
          _id: "$service_id",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },
    ]);

    res.status(200).json({
      message: "Top services retrieved successfully",
      data: topServices,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving top services", error: error.message });
  }
};

// GET /api/admin/stats/doctors - Get doctor statistics
exports.getDoctorStats = async (req, res) => {
  try {
    const doctorStats = await Appointment.aggregate([
      {
        $group: {
          _id: "$doctor_id",
          appointmentCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $sort: { appointmentCount: -1 } },
    ]);

    res.status(200).json({
      message: "Doctor statistics retrieved successfully",
      data: doctorStats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving doctor statistics",
      error: error.message,
    });
  }
};
