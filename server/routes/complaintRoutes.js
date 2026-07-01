const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignAgent,
  updateStatus,
  submitFeedback
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('customer'), createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaintById);

router.put('/:id/assign', protect, authorize('admin'), assignAgent);
router.put('/:id/status', protect, authorize('agent', 'admin'), updateStatus);
router.put('/:id/feedback', protect, authorize('customer'), submitFeedback);

module.exports = router;
