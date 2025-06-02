const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/auth'); // If you're using authentication

// Only admins can create jobs
router.post('/', protect, jobController.createJob);

// Get all jobs (public route)
router.get('/', jobController.getAllJobs);

// Get latest jobs (public route)
router.get('/latest', jobController.getLatestJobs);

// Update job status
router.put('/:id/status', protect, jobController.updateJobStatus);

// Delete job
router.delete('/:id', protect, jobController.deleteJob);

// Get job by ID (public route)
router.get('/:id', jobController.getJobById);

module.exports = router;