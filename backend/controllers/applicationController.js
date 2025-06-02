// controllers/applicationController.js
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/cvs');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with user id, timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `cv-${req.user.id}-${uniqueSuffix}${fileExt}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only PDF, DOC, or DOCX
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

exports.upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({ 
      user: req.user.id,
      job: req.body.jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied for this job'
      });
    }

    // Validate job exists
    const job = await Job.findById(req.body.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    if (job.status !== 'Accepted') {
      return res.status(400).json({
        success: false,
        error: 'This job is not accepting applications at the moment'
      });
    }
    
    // Create application
    const application = await Application.create({
      user: req.user.id,
      job: req.body.jobId,
      nameWithInitials: req.body.nameWithInitials,
      fullName: req.body.fullName,
      gender: req.body.gender,
      dateOfBirth: new Date(req.body.dateOfBirth),
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      field: req.body.field,
      cvFilePath: req.file.path,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while submitting application'
    });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ 
      user: req.user.id,
      hiddenByUser: { $ne: true } // Exclude applications hidden by the user
    })
      .populate('job', 'type position field jobId')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching applications'
    });
  }
};

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

// Get shortlisted applications - admin only
exports.getShortlistedApplications = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    // Find only applications with "Shortlisted" status
    const applications = await Application.find({ status: 'Shortlisted' })
      .populate('job', 'jobId type position')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get shortlisted applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching shortlisted applications'
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

// Update interview details - admin only
exports.updateInterviewDetails = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update interview details'
      });
    }
    
    const { interviewDate, interviewTime, interviewLocation, interviewNotes } = req.body;
    
    // Validate required fields
    if (!interviewDate || !interviewTime || !interviewLocation) {
      return res.status(400).json({
        success: false, 
        error: 'Please provide date, time, and location'
      });
    }
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Update interview fields
    application.interviewDate = interviewDate;
    application.interviewTime = interviewTime;
    application.interviewLocation = interviewLocation;
    application.interviewNotes = interviewNotes || '';
    
    await application.save();
    
    // Send email notification to the applicant (optional)
    // You could implement email notifications here
    
    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Update interview details error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating interview details'
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
    
    // Delete CV file if it exists
    if (application.cvFilePath) {
      const fs = require('fs');
      const path = require('path');
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
    
    const path = require('path');
    const fs = require('fs');
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

// Hide application - user can hide their own applications
exports.hideApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Check if this application belongs to the current user
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this application'
      });
    }
    
    // Add hiddenByUser flag
    application.hiddenByUser = true;
    await application.save();
    
    res.status(200).json({
      success: true,
      message: 'Application hidden successfully'
    });
  } catch (error) {
    console.error('Hide application error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while hiding application'
    });
  }
};