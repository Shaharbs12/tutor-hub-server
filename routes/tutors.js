const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Tutor, User, Subject } = require('../models');
const { auth, requireUserType } = require('../middleware/auth');
const { validateTutorProfile } = require('../middleware/validation');

// @desc    Test route
// @route   GET /api/tutors/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Tutors route is working' });
});

// @desc    Get all tutors
// @route   GET /api/tutors
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('Fetching tutors...');
    
    // Simple query without complex includes first
    const tutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city']
        },
        {
          model: Subject,
          as: 'subjects',
          through: { attributes: [] } // Remove skill_level since column doesn't exist
        }
      ]
    });

    console.log(`Found ${tutors.length} tutors`);
    
    res.json({
      message: 'Tutors retrieved successfully',
      tutors: tutors,
      pagination: {
        limit: 10,
        offset: 0,
        total: tutors.length
      }
    });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ error: 'Failed to retrieve tutors', details: error.message });
  }
});

// @desc    Get tutors by student's preferred subjects
// @route   GET /api/tutors/matched
// @access  Private (Student only)
router.get('/matched', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is a student
    if (req.user.userType !== 'student') {
      return res.status(403).json({ error: 'Only students can access matched tutors' });
    }

    // Get student's preferred subjects
    const student = await Student.findOne({
      where: { userId },
      include: [
        {
          model: Subject,
          as: 'preferredSubjects',
          attributes: ['id', 'name', 'icon']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Get student's preferred subject IDs
    const preferredSubjectIds = student.preferredSubjects?.map(subject => subject.id) || [];
    
    if (preferredSubjectIds.length === 0) {
      return res.json({
        message: 'No preferred subjects found. Please add subjects to your preferences.',
        tutors: [],
        matchedSubjects: []
      });
    }

    // Find tutors who teach the student's preferred subjects
    const matchedTutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage', 'phone']
        },
        {
          model: Subject,
          as: 'subjects',
          where: { id: preferredSubjectIds },
          through: { attributes: [] }
        }
      ]
    });

    // Get the matched subjects for display
    const matchedSubjects = student.preferredSubjects?.filter(subject => 
      matchedTutors.some(tutor => 
        tutor.subjects?.some(tutorSubject => tutorSubject.id === subject.id)
      )
    ) || [];

    console.log(`Found ${matchedTutors.length} tutors for student's preferred subjects`);
    
    res.json({
      message: 'Matched tutors retrieved successfully',
      tutors: matchedTutors,
      matchedSubjects: matchedSubjects,
      studentPreferences: student.preferredSubjects || []
    });
  } catch (error) {
    console.error('Get matched tutors error:', error);
    res.status(500).json({ error: 'Failed to retrieve matched tutors', details: error.message });
  }
});

// @desc    Get tutors by specific subject
// @route   GET /api/tutors/subject/:subjectId
// @access  Public
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Find tutors who teach this specific subject
    const tutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage', 'phone']
        },
        {
          model: Subject,
          as: 'subjects',
          where: { id: subjectId },
          through: { attributes: [] }
        }
      ]
    });

    console.log(`Found ${tutors.length} tutors for subject: ${subject.name}`);
    
    res.json({
      message: `Tutors for ${subject.name} retrieved successfully`,
      subject: {
        id: subject.id,
        name: subject.name,
        icon: subject.icon,
        color: subject.color
      },
      tutors: tutors,
      count: tutors.length
    });
  } catch (error) {
    console.error('Get tutors by subject error:', error);
    res.status(500).json({ error: 'Failed to retrieve tutors for subject', details: error.message });
  }
});

// @desc    Get tutor by ID
// @route   GET /api/tutors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage', 'phone']
        },
        {
          model: Subject,
          as: 'subjects',
          through: { attributes: [] }
        }
      ]
    });

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.json({
      message: 'Tutor retrieved successfully',
      tutor
    });
  } catch (error) {
    console.error('Get tutor error:', error);
    res.status(500).json({ error: 'Failed to retrieve tutor' });
  }
});

// @desc    Update tutor profile
// @route   PUT /api/tutors/profile
// @access  Private (Tutor only)
router.put('/profile', auth, requireUserType('tutor'), validateTutorProfile, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, experienceYears, hourlyRate, subjects, availabilitySchedule } = req.body;

    // Find tutor profile
    const tutor = await Tutor.findOne({ where: { userId } });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor profile not found' });
    }

    // Update tutor profile
    await tutor.update({
      bio,
      experienceYears,
      hourlyRate,
      availabilitySchedule
    });

    // Update subjects if provided
    if (subjects && subjects.length > 0) {
      // Remove existing subjects
      await tutor.setSubjects([]);
      
      // Add new subjects with skill levels
      const subjectData = subjects.map(subjectId => ({
        subjectId,
        skillLevel: 'intermediate' // Default, can be customized
      }));
      
      await tutor.setSubjects(subjects);
    }

    // Fetch updated tutor with relations
    const updatedTutor = await Tutor.findByPk(tutor.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage']
        },
        {
          model: Subject,
          as: 'subjects',
          through: { attributes: [] }
        }
      ]
    });

    res.json({
      message: 'Tutor profile updated successfully',
      tutor: updatedTutor
    });
  } catch (error) {
    console.error('Update tutor profile error:', error);
    res.status(500).json({ error: 'Failed to update tutor profile' });
  }
});

module.exports = router;