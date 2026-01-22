const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);

// Admin routes
// TODO: Re-enable authentication for production
// For development, auth is temporarily disabled
router.post('/', createMenuItem); // protect, authorize('admin') - disabled for dev
router.put('/:id', updateMenuItem); // protect, authorize('admin') - disabled for dev
router.delete('/:id', deleteMenuItem); // protect, authorize('admin') - disabled for dev

module.exports = router;
