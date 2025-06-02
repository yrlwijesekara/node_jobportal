// filepath: c:\Users\M S I\Desktop\node_jobportal\backend\routes\authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', protect, authController.getCurrentUser);

// Verify user (protected route)
router.get('/verify', protect, (req, res) => {
  res.status(200).json({ valid: true });
});

module.exports = router;