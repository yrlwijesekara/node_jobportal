const Job = require('../models/Job');

// Create new job
exports.createJob = async (req, res) => {
  try {
    // Add the user ID from the authenticated request to track who created the job
    const newJob = new Job({
      ...req.body,
      createdBy: req.user.id
    });
    
    const savedJob = await newJob.save();
    
    res.status(201).json({
      success: true,
      job: savedJob
    });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during job creation'
    });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    // Add filters based on query parameters
    const filters = {};
    
    if (req.query.field) {
      filters.field = req.query.field;
    }
    
    if (req.query.status) {
      filters.status = req.query.status;
    } else {
      // By default, only show accepted jobs
      filters.status = 'Accepted';
    }
    
    // Add search functionality
    if (req.query.search) {
      filters.$or = [
        { type: { $regex: req.query.search, $options: 'i' } },
        { position: { $regex: req.query.search, $options: 'i' } },
        { field: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const jobs = await Job.find(filters).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching jobs'
    });
  }
};

// Get latest jobs
exports.getLatestJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Accepted' })
      .sort('-createdAt')
      .limit(4); // Get only the 4 most recent jobs
      
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get latest jobs error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching latest jobs'
    });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching job details'
    });
  }
};

// Update job status
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }
    
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    job.status = status;
    await job.save();
    
    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating job status'
    });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Replace job.remove() with one of these options:
    // Option 1: Use deleteOne() method
    await job.deleteOne();
    
    // OR Option 2: Use findByIdAndDelete (if you prefer)
    // await Job.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Job successfully deleted'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting job'
    });
  }
};