require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db');
const usersRouter = require('./routers/usersRouter');
const todosRouter = require('./routers/todosRouter');
const cors = require('cors');

// Middleware (optional, e.g., JSON parsing)
app.use(express.json());

// Set CORS policy and custom header
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Root route
app.get('/what', (req, res) => {
  res.send('Hello, hello!');
});

// Use usersRouter for /api/users endpoints
app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
