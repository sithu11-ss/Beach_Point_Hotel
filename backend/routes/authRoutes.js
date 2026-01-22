const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseAdmin');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');

// @desc    Verify Firebase ID token
// @route   POST /api/auth/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'ID token is required'
      });
    }

    if (!admin.apps.length) {
      return res.status(503).json({
        success: false,
        error: 'Firebase Admin is not initialized on the server. Check backend env (FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS).'
      });
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

// @desc    Get current user info (protected route)
// @route   GET /api/auth/me
// @access  Protected
router.get('/me', verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
