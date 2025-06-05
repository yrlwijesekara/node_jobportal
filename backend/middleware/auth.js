const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log("Raw token received:", token);
      
      // Basic validation - JWT tokens always have 2 dots (header.payload.signature)
      if (!token || token === 'undefined' || token === 'null' || !token.includes('.')) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid token format' 
        });
      }
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized to access this route' 
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      console.log("Token verification error:", error);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false, 
      error: 'Server error in authentication middleware' 
    });
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      error: 'Not authorized. Admin access required' 
    });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  // First check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated'
    });
  }
  
  // Then check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied: Admin privileges required'
    });
  }
  
  next();
};