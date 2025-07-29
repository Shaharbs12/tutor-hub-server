const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'conversation_id'
  },
  senderUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sender_user_id'
  },
  messageText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'message_text'
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file'),
    defaultValue: 'text',
    field: 'message_type'
  },
  attachmentUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'attachment_url'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read'
  }
}, {
  tableName: 'messages',
  updatedAt: false
});

module.exports = Message;