const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  const { firstName, lastName, username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ firstName, lastName, username, email, password, role });
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('firstName lastName username email');
    const formattedAgents = agents.map(a => ({
      _id: a._id,
      name: `${a.firstName} ${a.lastName}`,
      email: a.email
    }));
    res.json(formattedAgents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin routes to fetch all customers and agents
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).select('firstName lastName username email createdAt');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAgentsList = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('firstName lastName username email createdAt');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
