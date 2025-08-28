const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Root route
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

// Mock authentication routes
app.post('/api/auth/login', (req, res) => {
  console.log("hello");
  const { email, password } = req.body;
  // Mock login - accept any email/password for testing
  if (email && password) {
    const mockUser = {
      id: 1,
      email: email,
      firstName: 'Test',
      lastName: 'User',
      userType: 'student', // or 'tutor'
      isActive: true
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    res.json({
      token: mockToken,
      user: mockUser,
      message: 'Login successful'
    });
  } else {
    res.status(400).json({ error: 'Email and password are required' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName, userType } = req.body;
  
  // Mock registration
  if (email && password && firstName && lastName && userType) {
    const mockUser = {
      id: 2,
      email: email,
      firstName: firstName,
      lastName: lastName,
      userType: userType,
      isActive: true
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    res.json({
      token: mockToken,
      user: mockUser,
      message: 'Registration successful'
    });
  } else {
    res.status(400).json({ error: 'All fields are required' });
  }
});

// Mock subjects API
app.get('/api/subjects', (req, res) => {
  const subjects = [
    { id: 1, name: 'Math', name_he: 'מתמטיקה', icon: '📊', color: '#3498db' },
    { id: 2, name: 'English', name_he: 'אנגלית', icon: '📖', color: '#e74c3c' },
    { id: 3, name: 'Programming', name_he: 'תכנות', icon: '💻', color: '#2ecc71' },
    { id: 4, name: 'Physics', name_he: 'פיזיקה', icon: '⚛️', color: '#f39c12' },
    { id: 5, name: 'Chemistry', name_he: 'כימיה', icon: '🧪', color: '#9b59b6' },
    { id: 6, name: 'French', name_he: 'צרפתית', icon: '🇫🇷', color: '#1abc9c' }
  ];
  
  res.json({ subjects });
});

// Mock tutors API
app.get('/api/tutors/subject/:id', (req, res) => {
  const subjectId = req.params.id;
  const mockTutors = [
    {
      id: 1,
      user: { firstName: 'John', lastName: 'Doe' },
      subjects: [{ id: subjectId, name: 'Math' }]
    },
    {
      id: 2,
      user: { firstName: 'Jane', lastName: 'Smith' },
      subjects: [{ id: subjectId, name: 'English' }]
    }
  ];
  
  res.json({
    subject: { id: subjectId, name: 'Math' },
    count: mockTutors.length,
    tutors: mockTutors
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple Tutor Hub server running on port ${PORT}`);
  console.log(`📱 Client served at http://localhost:${PORT}`);
  console.log(`🔗 API health check: http://localhost:${PORT}/api/health`);
}); 