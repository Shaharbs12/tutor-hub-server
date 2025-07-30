const express = require('express');
const router = express.Router();
const { Student, User, Subject } = require('../models');
const { auth, requireUserType } = require('../middleware/auth');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('Fetching students...');
    
    // Simple query without complex includes first
    const students = await Student.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city']
        }
      ]
    });

    console.log(`Found ${students.length} students`);
    
    res.json({
      message: 'Students retrieved successfully',
      students: students,
      pagination: {
        limit: 10,
        offset: 0,
        total: students.length
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to retrieve students', details: error.message });
  }
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage', 'phone']
        },
        {
          model: Subject,
          as: 'preferredSubjects',
          through: { attributes: [] }
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      message: 'Student retrieved successfully',
      student
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to retrieve student' });
  }
});

module.exports = router; 