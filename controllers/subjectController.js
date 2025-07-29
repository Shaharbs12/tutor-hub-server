const { Subject, Tutor, User } = require('../models');

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
      tutorWhere.rating = { [require('sequelize').Op.gte]: parseFloat(minRating) };
    }
    if (maxRate) {
      tutorWhere.hourlyRate = { [require('sequelize').Op.lte]: parseFloat(maxRate) };
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
          through: { attributes: ['skill_level'] }
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
      rating: { [require('sequelize').Op.gte]: parseFloat(minRating) }
    };

    if (maxRate) {
      whereClause.hourlyRate = { [require('sequelize').Op.lte]: parseFloat(maxRate) };
    }

    const includeClause = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'city', 'profileImage'],
        where: city ? { city: { [require('sequelize').Op.like]: `%${city}%` } } : {}
      }
    ];

    if (subject) {
      includeClause.push({
        model: Subject,
        as: 'subjects',
        where: { 
          [require('sequelize').Op.or]: [
            { name: { [require('sequelize').Op.like]: `%${subject}%` } },
            { nameHe: { [require('sequelize').Op.like]: `%${subject}%` } }
          ]
        },
        through: skillLevel ? { where: { skill_level: skillLevel } } : { attributes: ['skill_level'] }
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