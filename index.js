require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db');
const usersRouter = require('./routers/usersRouter');
const todosRouter = require('./routers/todosRouter');

// Middleware (optional, e.g., JSON parsing)
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Root route
app.get('/what', (req, res) => {
  res.send('Hello, hello!');
});

// Use usersRouter for /users endpoints
app.use('/users', usersRouter);
app.use('/todos', todosRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
