const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Create user
router.post('/', usersController.createUser);

// Get all users
router.get('/', usersController.getUsers);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Update user by ID
router.put('/:id', usersController.updateUser);

// Delete user by ID
router.delete('/:id', usersController.deleteUser);

module.exports = router;
