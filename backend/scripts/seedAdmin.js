const mongoose = require('mongoose');
const User = require('../models/User.js');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@jobportal.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return mongoose.disconnect();
    }
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@jobportal.com',
      password: 'admin123456', // This will be hashed by the pre-save hook
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created successfully');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    mongoose.disconnect();
  }
};

createAdmin();