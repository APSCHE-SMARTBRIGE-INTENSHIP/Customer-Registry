const Complaint = require('../models/Complaint');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Customer only)
const createComplaint = async (req, res) => {
  try {
    const { title, description, phone } = req.body;

    const complaintId = 'CMP-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      phone,
      customer: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'Agent') {
      query.agent = req.user._id;
    }
    // Admin gets all, so query remains empty

    const complaints = await Complaint.find(query).populate('customer', 'firstName lastName username email').populate('agent', 'firstName lastName username email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Assign complaint to an agent
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Admin only)
const assignComplaint = async (req, res) => {
  try {
    const { agentId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'Agent') {
      return res.status(400).json({ message: 'Invalid Agent' });
    }

    complaint.agent = agentId;
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Agent only)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Ensure agent is assigned to this complaint
    if (complaint.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    complaint.status = status;
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a message to a complaint
// @route   POST /api/complaints/:id/messages
// @access  Private (Customer, Agent, Admin)
const addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const isCustomer = complaint.customer.toString() === req.user._id.toString();
    const isAgent = complaint.agent && complaint.agent.toString() === req.user._id.toString();

    if (!isCustomer && !isAgent && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to add a message to this complaint' });
    }

    const newMessage = {
      sender: req.user._id,
      senderName: req.user.firstName ? `${req.user.firstName} ${req.user.lastName}` : req.user.username,
      role: req.user.role,
      text
    };

    complaint.messages.push(newMessage);
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Close a ticket and add feedback
// @route   PUT /api/complaints/:id/close
// @access  Private (Customer only)
const closeComplaint = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to leave feedback' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Can only close resolved complaints' });
    }

    complaint.feedback = { rating, comment };
    complaint.status = 'Closed';
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get analytics
// @route   GET /api/complaints/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });

    const complaintsWithFeedback = await Complaint.find({ 'feedback.rating': { $exists: true } });
    const totalRating = complaintsWithFeedback.reduce((acc, curr) => acc + curr.feedback.rating, 0);
    const avgRating = complaintsWithFeedback.length > 0 ? (totalRating / complaintsWithFeedback.length).toFixed(1) : 0;

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      avgRating: parseFloat(avgRating)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get customer history
// @route   GET /api/complaints/customer/:customerId
// @access  Private (Admin, Agent)
const getCustomerHistory = async (req, res) => {
  try {
    const complaints = await Complaint.find({ customer: req.params.customerId }).populate('agent', 'firstName lastName username').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
  createComplaint, 
  getComplaints, 
  assignComplaint, 
  updateStatus, 
  addMessage, 
  closeComplaint, 
  getAnalytics, 
  getCustomerHistory 
};
