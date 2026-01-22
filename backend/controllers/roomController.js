const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getAllRooms = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, maxGuests, available } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Max guests filter
    if (maxGuests) {
      query.maxGuests = { $gte: Number(maxGuests) };
    }
    
    // Availability filter
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }
    
    const rooms = await Room.find(query).sort({ price: 1 });
    
    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Admin
exports.createRoom = async (req, res) => {
  try {
    // Default images if not provided
    const defaultImages = [
      'https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    ];
    
    // Ensure image is always set (handle empty strings and undefined)
    const mainImage = req.body.image && req.body.image.trim() !== '' 
      ? req.body.image 
      : defaultImages[0];
    
    // Ensure images array is always set
    const imagesArray = req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0
      ? req.body.images
      : defaultImages;
    
    const roomData = {
      ...req.body,
      image: mainImage,
      images: imagesArray
    };
    
    const room = await Room.create(roomData);
    
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Admin
exports.updateRoom = async (req, res) => {
  try {
    // If frontend sends empty image string, ignore it (keep existing).
    // If image is missing and existing image is empty for any reason, set a default.
    const defaultImages = [
      'https://images.unsplash.com/photo-1611892440504-42a792e47d13?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    ];

    const existing = await Room.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const update = { ...req.body };
    if (typeof update.image === 'string' && update.image.trim() === '') {
      delete update.image;
    }
    if (Array.isArray(update.images) && update.images.length === 0) {
      delete update.images;
    }

    const willHaveMainImage =
      (typeof update.image === 'string' && update.image.trim() !== '') ||
      (typeof existing.image === 'string' && existing.image.trim() !== '');
    if (!willHaveMainImage) {
      update.image = defaultImages[0];
    }

    const willHaveGallery =
      (Array.isArray(update.images) && update.images.length > 0) ||
      (Array.isArray(existing.images) && existing.images.length > 0);
    if (!willHaveGallery) {
      update.images = defaultImages;
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete room (PERMANENT DELETE)
// @route   DELETE /api/rooms/:id
// @access  Admin
exports.deleteRoom = async (req, res) => {
  try {
    // Permanently delete room from database
    const room = await Room.findByIdAndDelete(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Check room availability
// @route   GET /api/rooms/:id/availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'Check-in and check-out dates are required'
      });
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Check for overlapping bookings
    const Booking = require('../models/Booking');
    const overlappingBookings = await Booking.find({
      room: req.params.id,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate }
        }
      ]
    });
    
    const isAvailable = overlappingBookings.length === 0;
    
    res.json({
      success: true,
      data: {
        available: isAvailable,
        checkIn: checkInDate,
        checkOut: checkOutDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
