const { Subject, Tutor, User } = require('../models');
const { Op } = require('sequelize');

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({
      message: 'Subjects retrieved successfully',
      subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to retrieve subjects' });
  }
};

// Get subject with tutors
const getSubjectWithTutors = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0, minRating, maxRate } = req.query;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Build where clause for tutors
    const tutorWhere = {};
    if (minRating) {
      tutorWhere.rating = { [Op.gte]: parseFloat(minRating) };
    }
    if (maxRate) {
      tutorWhere.hourlyRate = { [Op.lte]: parseFloat(maxRate) };
    }

    const tutors = await Tutor.findAll({
      where: tutorWhere,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage']
        },
        {
          model: Subject,
          as: 'subjects',
          where: { id },
          through: { attributes: [] } // Remove skill_level since column doesn't exist
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']]
    });

    res.json({
      message: 'Subject tutors retrieved successfully',
      subject,
      tutors,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: tutors.length
      }
    });
  } catch (error) {
    console.error('Get subject tutors error:', error);
    res.status(500).json({ error: 'Failed to retrieve subject tutors' });
  }
};

// Search tutors by subject
const searchTutors = async (req, res) => {
  try {
    const { 
      subject, 
      city, 
      minRating = 0, 
      maxRate, 
      skillLevel,
      limit = 10, 
      offset = 0 
    } = req.query;

    const whereClause = {
      rating: { [Op.gte]: parseFloat(minRating) }
    };

    if (maxRate) {
      whereClause.hourlyRate = { [Op.lte]: parseFloat(maxRate) };
    }

    const includeClause = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage'],
        where: city ? { city: { [Op.like]: `%${city}%` } } : {}
      }
    ];

    if (subject) {
      includeClause.push({
        model: Subject,
        as: 'subjects',
        where: { 
          [Op.or]: [
            { name: { [Op.like]: `%${subject}%` } },
            { nameHe: { [Op.like]: `%${subject}%` } }
          ]
        },
        through: skillLevel ? { where: { skill_level: skillLevel } } : { attributes: [] }
      });
    }

    const tutors = await Tutor.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']],
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
    console.error('Search tutors error:', error);
    res.status(500).json({ error: 'Failed to search tutors' });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectWithTutors,
  searchTutors
};