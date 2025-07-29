const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'student_user_id'
  },
  tutorUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tutor_user_id'
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'subject_id'
  },
  status: {
    type: DataTypes.ENUM('active', 'archived', 'blocked'),
    defaultValue: 'active'
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_message_at'
  }
}, {
  tableName: 'conversations'
});

module.exports = Conversation;