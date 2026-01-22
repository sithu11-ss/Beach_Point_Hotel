const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../config/firebaseAdmin');

// Protect routes - require authentication (supports both JWT and Firebase tokens)
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    // Try Firebase token first (for admin users)
    try {
      // Check if Firebase Admin is initialized
      if (admin.apps.length > 0) {
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          // Firebase token verified - attach user info
          req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
          };
          // Try to find user in database by email
          const user = await User.findOne({ email: decodedToken.email });
          if (user) {
            req.userId = user._id;
          }
          return next();
        } catch (firebaseVerifyError) {
          // Firebase token verification failed
          // Check if it's because Firebase Admin has no credentials
          if (firebaseVerifyError.code === 'app/no-app' || firebaseVerifyError.message.includes('no-app')) {
            console.log('Firebase Admin not properly initialized (no credentials), trying JWT');
          } else {
            console.log('Firebase token verification failed:', firebaseVerifyError.message);
          }
          // Continue to JWT verification
        }
      } else {
        console.log('Firebase Admin not initialized, trying JWT');
      }
    } catch (firebaseError) {
      // Firebase Admin error - try JWT
      console.log('Firebase Admin error, trying JWT:', firebaseError.message);
    }
    
    // Try JWT token
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.userId = decoded.userId;
      return next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: `User role '${user?.role}' is not authorized to access this route`
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
};
