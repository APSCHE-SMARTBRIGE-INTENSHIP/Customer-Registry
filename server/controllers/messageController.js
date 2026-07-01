const Message = require('../models/Message');
const Complaint = require('../models/Complaint');

exports.sendMessage = async (req, res) => {
  const { text } = req.body;
  const { complaintId } = req.params;
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (
      req.user.role === 'user' &&
      complaint.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to send messages here' });
    }
    if (
      req.user.role === 'agent' &&
      (!complaint.agent || complaint.agent.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to send messages here' });
    }

    const message = await Message.create({
      complaint: complaintId,
      sender: req.user._id,
      text
    });

    const populatedMessage = await message.populate('sender', 'firstName lastName role');
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { complaintId } = req.params;
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (
      req.user.role === 'user' &&
      complaint.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view messages' });
    }
    if (
      req.user.role === 'agent' &&
      (!complaint.agent || complaint.agent.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view messages' });
    }

    const messages = await Message.find({ complaint: complaintId })
      .populate('sender', 'firstName lastName role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
