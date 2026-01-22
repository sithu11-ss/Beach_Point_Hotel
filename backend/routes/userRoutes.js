const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;
