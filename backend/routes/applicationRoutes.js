// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

// Submit application - requires authentication
router.post(
  '/', 
  protect, 
  applicationController.upload.single('cv'), 
  applicationController.submitApplication
);

// Get user's applications - requires authentication
router.get('/me', protect, applicationController.getUserApplications);

// Get all applications - admin only
router.get('/all', protect, applicationController.getAllApplications);

// Get shortlisted applications - admin only
router.get('/shortlisted', protect, applicationController.getShortlistedApplications);

// Update application status - admin only
router.put('/:id/status', protect, applicationController.updateApplicationStatus);

// Update interview details - admin only
router.put('/:id/interview', protect, applicationController.updateInterviewDetails);

// Delete application - admin only
router.delete('/:id', protect, applicationController.deleteApplication);

// Download CV - admin only
router.get('/:id/cv', protect, applicationController.downloadCV);

// Hide application - user can hide their own applications
router.put('/:id/hide', protect, applicationController.hideApplication);

module.exports = router;