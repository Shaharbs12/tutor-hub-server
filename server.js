const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/students', require('./routes/students'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/admin', require('./routes/admin'));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Root route - must be after API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Tutor Hub API is running',
    timestamp: new Date().toISOString()
  });
});

// API health check
app.get('/auth/login', (req, res) => {
  console.log('auth/login');
  res.json({ 
    status: 'OK', 
    message: 'Tutor Hub API is running',
    timestamp: new Date().toISOString()
  });
});


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server AFTER DB connection
const startServer = async () => {
  try {
    await connectDB(); // Initialize SQLite and sync tables
    app.listen(PORT, () => {
      console.log(`🚀 Tutor Hub server running on port ${PORT}`);
      console.log(`📱 Client served at http://localhost:${PORT}`);
      console.log(`🔗 API health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database. Server not started.', error);
  }
};

startServer();
