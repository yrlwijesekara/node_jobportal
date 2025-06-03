const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already registered' 
      });
    }
    
    // Determine if this should be an admin user
    const role = adminCode === process.env.ADMIN_SECRET_CODE ? 'admin' : 'user';
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during registration' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user'
    });
  }
};