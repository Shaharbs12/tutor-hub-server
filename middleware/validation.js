const { body, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('userType')
    .isIn(['student', 'tutor'])
    .withMessage('User type must be either student or tutor'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Tutor profile validation
const validateTutorProfile = [
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must not exceed 1000 characters'),
  body('experienceYears')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience years must be between 0 and 50'),
  body('hourlyRate')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Hourly rate must be between 0 and 1000'),
  body('subjects')
    .isArray({ min: 1 })
    .withMessage('At least one subject must be selected'),
  body('subjects.*')
    .isInt({ min: 1 })
    .withMessage('Invalid subject ID'),
  handleValidationErrors
];

// Student profile validation
const validateStudentProfile = [
  body('gradeLevel')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Grade level must not exceed 50 characters'),
  body('learningGoals')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Learning goals must not exceed 500 characters'),
  body('preferredLearningStyle')
    .optional()
    .isIn(['visual', 'auditory', 'kinesthetic', 'reading'])
    .withMessage('Invalid learning style'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateTutorProfile,
  validateStudentProfile,
  handleValidationErrors
};