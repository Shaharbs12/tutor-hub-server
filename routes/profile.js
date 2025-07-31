const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getTutorSchedule,
  updateTutorSchedule,
  getStudentPreferences,
  updateStudentPreferences,
  addStudentSubject,
  removeStudentSubject,
  updateUserSubject
} = require('../controllers/profileController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validation middleware for profile updates
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phoneNumber')
    .optional()
    .matches(/^[\d\-\+\(\)\s]+$/)
    .withMessage('Please provide a valid phone number'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  handleValidationErrors
];

const validateTutorSchedule = [
  body('availability')
    .isArray()
    .withMessage('Availability must be an array'),
  body('availability.*.day')
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day'),
  body('availability.*.startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid start time format'),
  body('availability.*.endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format'),
  handleValidationErrors
];

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/', auth, getProfile);

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
router.put('/', auth, validateProfileUpdate, updateProfile);

// @desc    Upload profile image
// @route   POST /api/profile/image
// @access  Private
router.post('/image', auth, uploadProfileImage);

// @desc    Get tutor schedule
// @route   GET /api/profile/schedule
// @access  Private (Tutors only)
router.get('/schedule', auth, getTutorSchedule);

// @desc    Update tutor schedule
// @route   PUT /api/profile/schedule
// @access  Private (Tutors only)
router.put('/schedule', auth, validateTutorSchedule, updateTutorSchedule);

// @desc    Get student preferences
// @route   GET /api/profile/preferences
// @access  Private (Students only)
router.get('/preferences', auth, getStudentPreferences);

// @desc    Update student preferences
// @route   PUT /api/profile/preferences
// @access  Private (Students only)
router.put('/preferences', auth, updateStudentPreferences);

// @desc    Add subject to student preferences
// @route   POST /api/profile/subjects
// @access  Private (Students only)
router.post('/subjects', auth, addStudentSubject);

// @desc    Remove subject from student preferences
// @route   DELETE /api/profile/subjects/:subjectId
// @access  Private (Students only)
router.delete('/subjects/:subjectId', auth, removeStudentSubject);

// @desc    Update user's primary subject
// @route   PUT /api/profile/subject
// @access  Private
router.put('/subject', auth, updateUserSubject);

module.exports = router;