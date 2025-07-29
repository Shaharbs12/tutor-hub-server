const { Conversation, Message, User } = require('../models');
const { Op } = require('sequelize');

// Get user conversations
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { studentUserId: userId },
          { tutorUserId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
        {
          model: User,
          as: 'tutor', 
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          attributes: ['messageText', 'createdAt', 'isRead']
        }
      ],
      order: [['lastMessageAt', 'DESC']]
    });
    
    res.json({
      message: 'Conversations retrieved successfully',
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
};

// Get or create conversation
const getOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId, subjectId } = req.body;
    
    if (!partnerId) {
      return res.status(400).json({ error: 'Partner ID is required' });
    }
    
    // Check if partner exists
    const partner = await User.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Determine student and tutor roles
    let studentUserId, tutorUserId;
    if (req.user.userType === 'student') {
      studentUserId = userId;
      tutorUserId = partnerId;
    } else {
      studentUserId = partnerId;
      tutorUserId = userId;
    }
    
    // Find existing conversation
    let conversation = await Conversation.findOne({
      where: {
        studentUserId,
        tutorUserId
      },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
        {
          model: User,
          as: 'tutor',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        }
      ]
    });
    
    // Create if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        studentUserId,
        tutorUserId,
        subjectId: subjectId || null,
        status: 'active'
      });
      
      // Reload with associations
      conversation = await Conversation.findByPk(conversation.id, {
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'profileImage']
          },
          {
            model: User,
            as: 'tutor',
            attributes: ['id', 'firstName', 'lastName', 'profileImage']
          }
        ]
      });
    }
    
    res.json({
      message: 'Conversation retrieved successfully',
      conversation
    });
  } catch (error) {
    console.error('Get/create conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

// Get conversation messages
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;
    
    // Verify user has access to this conversation
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        [Op.or]: [
          { studentUserId: userId },
          { tutorUserId: userId }
        ]
      }
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Mark messages as read
    await Message.update(
      { isRead: true },
      {
        where: {
          conversationId,
          senderUserId: { [Op.ne]: userId },
          isRead: false
        }
      }
    );
    
    res.json({
      message: 'Messages retrieved successfully',
      messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: messages.length
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, messageText, messageType = 'text' } = req.body;
    
    if (!conversationId || !messageText) {
      return res.status(400).json({ error: 'Conversation ID and message text are required' });
    }
    
    // Verify user has access to this conversation
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        [Op.or]: [
          { studentUserId: userId },
          { tutorUserId: userId }
        ]
      }
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Create message
    const message = await Message.create({
      conversationId,
      senderUserId: userId,
      messageText: messageText.trim(),
      messageType,
      isRead: false
    });
    
    // Update conversation last message time
    await conversation.update({
      lastMessageAt: new Date()
    });
    
    // Load message with sender info
    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        }
      ]
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      message: messageWithSender
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    
    const message = await Message.findOne({
      where: {
        id: messageId,
        senderUserId: userId
      }
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }
    
    await message.destroy();
    
    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

// Archive conversation
const archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        [Op.or]: [
          { studentUserId: userId },
          { tutorUserId: userId }
        ]
      }
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    await conversation.update({ status: 'archived' });
    
    res.json({
      message: 'Conversation archived successfully'
    });
  } catch (error) {
    console.error('Archive conversation error:', error);
    res.status(500).json({ error: 'Failed to archive conversation' });
  }
};

module.exports = {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  archiveConversation
};