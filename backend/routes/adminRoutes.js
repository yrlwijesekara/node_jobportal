const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Make sure this line matches the function name in your adminController.js
router.put('/promote/:userId', protect, admin, adminController.promoteToAdmin);

module.exports = router;