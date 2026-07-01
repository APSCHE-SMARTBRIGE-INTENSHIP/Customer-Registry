const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:complaintId')
  .post(protect, sendMessage)
  .get(protect, getMessages);

module.exports = router;
