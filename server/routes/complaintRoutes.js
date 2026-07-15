const express = require('express');
const {
  createComplaint,
  getComplaints,
  assignComplaint,
  updateStatus,
  addMessage,
  closeComplaint,
  getAnalytics,
  getCustomerHistory,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, authorize('Customer'), createComplaint)
  .get(protect, getComplaints);

router.route('/analytics')
  .get(protect, authorize('Admin'), getAnalytics);

router.route('/customer/:customerId')
  .get(protect, authorize('Admin', 'Agent'), getCustomerHistory);

router.route('/:id/assign')
  .patch(protect, authorize('Admin'), assignComplaint);

router.route('/:id/status')
  .patch(protect, authorize('Agent'), updateStatus);

router.route('/:id/messages')
  .post(protect, addMessage); // Auth logic handled in controller (Customer/Agent/Admin)

router.route('/:id/close')
  .put(protect, authorize('Customer'), closeComplaint);

module.exports = router;
