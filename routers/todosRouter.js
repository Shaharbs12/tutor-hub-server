const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todosController');

// Get all todos
router.get('/', todosController.getTodos);

// Get todo by ID
router.get('/:id', todosController.getTodoById); // get todo by id

module.exports = router; 