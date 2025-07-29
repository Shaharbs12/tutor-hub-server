const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tutor = sequelize.define('Tutor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'user_id'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'experience_years'
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'hourly_rate'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_reviews'
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_students'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  availabilitySchedule: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'availability_schedule'
  }
}, {
  tableName: 'tutors'
});

module.exports = Tutor;