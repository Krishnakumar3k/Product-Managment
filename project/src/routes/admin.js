const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/admin/login
// @desc    Admin login
router.post('/login', adminController.login);

// @route   GET /api/admin/users
// @desc    Get user list with search functionality
router.get('/users', [auth, admin], adminController.getUserList);

// @route   PUT /api/admin/users/:userId
// @desc    Update user status (approve/reject/block/activate)
router.put('/users/:userId', [auth, admin], adminController.updateUserStatus);

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user
router.delete('/users/:userId', [auth, admin], adminController.deleteUser);

module.exports = router;