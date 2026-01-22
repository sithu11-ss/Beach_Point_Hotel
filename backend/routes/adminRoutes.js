const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Menu = require('../models/Menu');
const User = require('../models/User');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalMenuItems = await Menu.countDocuments();
    
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const checkedInBookings = await Booking.countDocuments({ status: 'checked-in' });
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          checkedIn: checkedInBookings
        },
        rooms: totalRooms,
        users: totalUsers,
        menuItems: totalMenuItems,
        revenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
