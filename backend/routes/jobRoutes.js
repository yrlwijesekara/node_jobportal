const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

// Public specific routes - MUST COME BEFORE PARAMETER ROUTES
router.get('/public', jobController.getPublicJobs); // Move this up
router.get('/latest', jobController.getLatestJobs);

// Protected routes (specific)
router.post('/', protect, jobController.createJob);
router.get('/', protect, jobController.getAllJobs);
router.put('/:id/status', protect, jobController.updateJobStatus);
router.delete('/:id', protect, jobController.deleteJob);

// Parameter routes (catch-all) - MUST COME LAST
router.get('/:id', jobController.getJobById);

module.exports = router;