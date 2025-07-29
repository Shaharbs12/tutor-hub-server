const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
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
  gradeLevel: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'grade_level'
  },
  learningGoals: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'learning_goals'
  },
  preferredLearningStyle: {
    type: DataTypes.ENUM('visual', 'auditory', 'kinesthetic', 'reading'),
    allowNull: true,
    field: 'preferred_learning_style'
  }
}, {
  tableName: 'students'
});

module.exports = Student;