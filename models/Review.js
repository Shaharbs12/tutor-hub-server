const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tutorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tutor_id'
  },
  studentUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'student_user_id'
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'subject_id'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'review_text'
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_anonymous'
  }
}, {
  tableName: 'reviews'
});

module.exports = Review;