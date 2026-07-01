const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  const { name, phone, email, description } = req.body;
  try {
    const complaint = await Complaint.create({
      name,
      phone,
      email,
      description,
      customer: req.user._id
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query = { customer: req.user._id };
    } else if (req.user.role === 'agent') {
      query = { agent: req.user._id };
    }
    const complaints = await Complaint.find(query)
      .populate('customer', 'firstName lastName email')
      .populate('agent', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customer', 'firstName lastName email')
      .populate('agent', 'firstName lastName email');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (
      req.user.role === 'user' &&
      complaint.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }
    if (
      req.user.role === 'agent' &&
      (!complaint.agent || complaint.agent._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignAgent = async (req, res) => {
  const { agentId } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    complaint.agent = agentId;
    if (complaint.status === 'pending') {
      complaint.status = 'in_progress';
    }
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    complaint.status = status;
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  const { rating, comments } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (complaint.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    complaint.feedback = { rating, comments };
    complaint.status = 'closed';
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
