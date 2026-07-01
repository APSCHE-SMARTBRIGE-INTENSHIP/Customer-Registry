const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAgents, getAllCustomers, getAllAgentsList } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/agents', protect, getAgents);
router.get('/customers', protect, authorize('admin'), getAllCustomers);
router.get('/agents-list', protect, authorize('admin'), getAllAgentsList);

module.exports = router;
