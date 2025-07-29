const express = require('express');
const router = express.Router();
const { Tutor, User, Subject } = require('../models');
const { auth, requireUserType } = require('../middleware/auth');
const { validateTutorProfile } = require('../middleware/validation');

// @desc    Get all tutors
// @route   GET /api/tutors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, subject, city, minRating = 0 } = req.query;

    const whereClause = {
      rating: { [require('sequelize').Op.gte]: parseFloat(minRating) }
    };

    const includeClause = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage'],
        where: city ? { city: { [require('sequelize').Op.like]: `%${city}%` } } : {}
      },
      {
        model: Subject,
        as: 'subjects',
        through: { attributes: ['skill_level'] }
      }
    ];

    const tutors = await Tutor.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating', 'DESC']],
      distinct: true
    });

    res.json({
      message: 'Tutors retrieved successfully',
      tutors: tutors.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: tutors.count
      }
    });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ error: 'Failed to retrieve tutors' });
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
          through: { attributes: ['skill_level'] }
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
          through: { attributes: ['skill_level'] }
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