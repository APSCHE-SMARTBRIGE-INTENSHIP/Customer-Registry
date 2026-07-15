const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Route for admin to get agents
router.get('/agents', protect, authorize('Admin'), async (req, res) => {
  try {
    const agents = await User.find({ role: 'Agent' }).select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Route for admin to get customers
router.get('/customers', protect, authorize('Admin'), async (req, res) => {
  try {
    const customers = await User.find({ role: 'Customer' }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
