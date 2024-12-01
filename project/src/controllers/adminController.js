const User = require('../models/User');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'user' };

    if (search) {
      query = {
        ...query,
        $or: [
          { firstName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phoneNumber: new RegExp(search, 'i') }
        ]
      };
    }

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    switch (action) {
      case 'approve':
        user.isApproved = true;
        break;
      case 'reject':
        user.isApproved = false;
        break;
      case 'block':
        user.isActive = false;
        break;
      case 'activate':
        user.isActive = true;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};