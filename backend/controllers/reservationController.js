const Reservation = require('../models/Reservation');
const { sendReservationConfirmation } = require('../utils/emailService');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
exports.getAllReservations = async (req, res) => {
  try {
    const { date, status } = req.query;
    
    let query = {};
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (status) query.status = status;
    
    const reservations = await Reservation.find(query)
      .sort({ date: 1, time: 1 });
    
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Public
exports.createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;
    
    // Validate date is not in the past
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (reservationDate < today) {
      return res.status(400).json({
        success: false,
        error: 'Reservation date cannot be in the past'
      });
    }
    
    // Create reservation
    const reservation = await Reservation.create({
      name,
      email: email.toLowerCase(),
      phone,
      date: reservationDate,
      time,
      guests,
      specialRequests: specialRequests || '',
      status: 'confirmed'
    });
    
    // Send confirmation email (non-blocking)
    try {
      await sendReservationConfirmation({
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests
      });
    } catch (emailError) {
      console.error('Email sending failed, but reservation was created:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Cancel reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
    }
    
    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Reservation is already cancelled'
      });
    }
    
    reservation.status = 'cancelled';
    await reservation.save();
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
