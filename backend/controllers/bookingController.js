const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { sendBookingConfirmation } = require('../utils/emailService');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getAllBookings = async (req, res) => {
  try {
    const { userId, status, roomId } = req.query;
    
    let query = {};
    
    if (userId) query.user = userId;
    if (status) query.status = status;
    if (roomId) query.room = roomId;
    
    const bookings = await Booking.find(query)
      .populate('room', 'name price image')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, guestInfo, subtotal, tax, totalPrice } = req.body;
    
    // Validate required fields
    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: 'Room ID is required'
      });
    }
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'Check-in and check-out dates are required'
      });
    }
    
    if (!guests || guests < 1) {
      return res.status(400).json({
        success: false,
        error: 'Number of guests is required and must be at least 1'
      });
    }
    
    if (!guestInfo || !guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      return res.status(400).json({
        success: false,
        error: 'Guest information is required (firstName, lastName, email, phone)'
      });
    }
    
    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    // Check availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Validate dates
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }
    
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        error: 'Check-out date must be after check-in date'
      });
    }
    
    const overlappingBookings = await Booking.find({
      room: roomId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });
    
    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Room is not available for the selected dates'
      });
    }
    
    // Create or find user
    const User = require('../models/User');
    let user = await User.findOne({ email: guestInfo.email.toLowerCase() });
    
    if (!user) {
      user = await User.create({
        firstName: guestInfo.firstName,
        lastName: guestInfo.lastName,
        email: guestInfo.email,
        phone: guestInfo.phone,
        role: 'guest'
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      room: roomId,
      user: user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      guestInfo,
      subtotal,
      tax,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'paid'
    });
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user');
    
    // Send confirmation email (non-blocking - don't fail booking if email fails)
    try {
      await sendBookingConfirmation({
        guestInfo: populatedBooking.guestInfo,
        room: populatedBooking.room,
        checkIn: populatedBooking.checkIn,
        checkOut: populatedBooking.checkOut,
        guests: populatedBooking.guests,
        totalPrice: populatedBooking.totalPrice,
        bookingReference: populatedBooking.bookingReference
      });
    } catch (emailError) {
      console.error('Email sending failed, but booking was created:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create booking',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('room').populate('user');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get booking by reference
// @route   GET /api/bookings/reference/:reference
// @access  Public
exports.getBookingByReference = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingReference: req.params.reference })
      .populate('room')
      .populate('user');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
