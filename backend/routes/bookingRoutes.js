const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingByReference
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', createBooking);
router.get('/reference/:reference', getBookingByReference);

// GET /api/bookings - Allow without auth for admin dashboard (frontend is already protected)
// TODO: Re-enable protect middleware once Firebase Admin credentials are properly configured
router.get('/', getAllBookings);

// Protected routes
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
