const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST /api/users/signup
// @desc    Register a user
router.post('/signup', [
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phoneNumber', 'Please include a valid phone number').notEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('location', 'Location is required').notEmpty()
], userController.signup);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post('/login', userController.login);

module.exports = router;