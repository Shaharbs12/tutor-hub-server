const express = require('express');
const router = express.Router();
const { 
  getAllSubjects, 
  getSubjectWithTutors, 
  searchTutors 
} = require('../controllers/subjectController');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
router.get('/', getAllSubjects);

// @desc    Get subject with tutors
// @route   GET /api/subjects/:id/tutors
// @access  Public
router.get('/:id/tutors', getSubjectWithTutors);

// @desc    Search tutors
// @route   GET /api/subjects/search/tutors
// @access  Public
router.get('/search/tutors', searchTutors);

module.exports = router;