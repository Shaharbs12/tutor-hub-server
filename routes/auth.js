const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require('../middleware/validation');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateUserRegistration, register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateUserLogin, login);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', auth, getCurrentUser);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', auth, updateProfile);

module.exports = router;