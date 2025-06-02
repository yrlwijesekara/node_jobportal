const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Promote a user to admin (requires admin privileges)
exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.role = 'admin';
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User promoted to admin successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin promotion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while promoting user'
    });
  }
};

router.put('/promote/:userId', protect, admin, adminController.promoteToAdmin);

module.exports = router;