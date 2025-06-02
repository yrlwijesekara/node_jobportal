// models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  nameWithInitials: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  cvFilePath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hiddenByUser: {
    type: Boolean,
    default: false
  },
  interviewDate: {
    type: String,
    default: null
  },
  interviewTime: {
    type: String,
    default: null
  },
  interviewLocation: {
    type: String,
    default: null
  },
  interviewNotes: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);

// Get all applications - admin only
exports.getAllApplications = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    const applications = await Application.find()
      .populate('job', 'jobId type position')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching applications'
    });
  }
};

// Update application status - admin only
exports.updateApplicationStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update application status'
      });
    }

    const { status } = req.body;
    
    if (!['Pending', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    application.status = status;
    await application.save();
    
    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating application status'
    });
  }
};

// Delete application - admin only
exports.deleteApplication = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete applications'
      });
    }
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Delete CV file
    if (application.cvFilePath) {
      const fullPath = path.resolve(application.cvFilePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    await application.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Application successfully deleted'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting application'
    });
  }
};

// Download CV - admin only
exports.downloadCV = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to download CVs'
      });
    }
    
    const application = await Application.findById(req.params.id);
    
    if (!application || !application.cvFilePath) {
      return res.status(404).json({
        success: false,
        error: 'CV not found'
      });
    }
    
    const fullPath = path.resolve(application.cvFilePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        error: 'CV file not found on server'
      });
    }
    
    res.download(fullPath);
  } catch (error) {
    console.error('Download CV error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while downloading CV'
    });
  }
};