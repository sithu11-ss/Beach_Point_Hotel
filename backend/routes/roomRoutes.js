const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.get('/:id/availability', checkAvailability);

// Admin routes
// TODO: Re-enable authentication for production
// For development, auth is temporarily disabled
router.post('/', createRoom); // protect, authorize('admin') - disabled for dev
router.put('/:id', updateRoom); // protect, authorize('admin') - disabled for dev
router.delete('/:id', deleteRoom); // protect, authorize('admin') - disabled for dev

module.exports = router;
