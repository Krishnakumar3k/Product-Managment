const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/User'); // Import User model
const { validationResult } = require('express-validator');

// Admin login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured.' });
    }

    // Find admin user by email and role
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password in the database
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET, // Secure key from environment
      { expiresIn: '24h' }
    );

    // Send token in response
    res.json({ token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get list of users
exports.getUserList = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'user' };

    // Apply search filter if provided
    if (search) {
      query = {
        ...query,
        $or: [
          { firstName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phoneNumber: new RegExp(search, 'i') },
        ],
      };
    }

    // Fetch users excluding the password field
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user status based on action
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
    console.error("Error updating user status:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete user by ID
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
