const express = require('express');
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  archiveConversation
} = require('../controllers/chatController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validation middleware for messages
const validateMessage = [
  body('messageText')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Invalid message type'),
  handleValidationErrors
];

const validateConversation = [
  body('partnerId')
    .isInt({ min: 1 })
    .withMessage('Valid partner ID is required'),
  body('subjectId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Subject ID must be a valid number'),
  handleValidationErrors
];

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Private
router.get('/conversations', auth, getConversations);

// @desc    Get or create conversation with another user
// @route   POST /api/chat/conversations
// @access  Private
router.post('/conversations', auth, validateConversation, getOrCreateConversation);

// @desc    Get messages from a conversation
// @route   GET /api/chat/conversations/:conversationId/messages
// @access  Private
router.get('/conversations/:conversationId/messages', auth, getMessages);

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
router.post('/messages', auth, validateMessage, sendMessage);

// @desc    Delete a message
// @route   DELETE /api/chat/messages/:messageId
// @access  Private
router.delete('/messages/:messageId', auth, deleteMessage);

// @desc    Archive a conversation
// @route   PUT /api/chat/conversations/:conversationId/archive
// @access  Private
router.put('/conversations/:conversationId/archive', auth, archiveConversation);

module.exports = router;