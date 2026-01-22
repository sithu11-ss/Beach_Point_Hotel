const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', createReservation);

// Protected routes
router.get('/', protect, getAllReservations);
router.get('/:id', protect, getReservationById);
router.put('/:id', protect, updateReservation);
router.put('/:id/cancel', protect, cancelReservation);

module.exports = router;
