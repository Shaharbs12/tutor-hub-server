const axios = require('axios');

async function testRealUsers() {
  try {
    console.log('Testing login with real users from database...');
    
    // Test the health endpoint first
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // List of real users from the database
    const realUsers = [
      { email: 'margarita@tutorhub.com', password: 'password123', type: 'tutor' },
      { email: 'shahrukh@tutorhub.com', password: 'password123', type: 'tutor' },
      { email: 'max@tutorhub.com', password: 'password123', type: 'tutor' },
      { email: 'john.student@tutorhub.com', password: 'password123', type: 'student' },
      { email: 'jane.student@tutorhub.com', password: 'password123', type: 'student' },
      { email: 'david.student@tutorhub.com', password: 'password123', type: 'student' },
      { email: 'kozo@gmail.com', password: 'password123', type: 'tutor' },
      { email: 'yuvalzi@gmail.com', password: 'password123', type: 'student' },
      { email: 'guy@gmail.com', password: 'password123', type: 'tutor' },
      { email: 'guy12@gmail.com', password: 'password123', type: 'tutor' },
      { email: 'shaharbs524@gmail.com', password: 'password123', type: 'student' },
      { email: 'meshi-y@hotmail.com', password: 'password123', type: 'student' },
      { email: 'shrbnsymwn85@gmail.com', password: 'password123', type: 'student' },
      { email: 'shrbnsymwn87@gmail.com', password: 'password123', type: 'student' }
    ];
    
    console.log(`\nTesting ${realUsers.length} real users from database...`);
    
    for (const user of realUsers) {
      try {
        console.log(`\n--- Testing ${user.type}: ${user.email} ---`);
        
        const response = await axios.post('http://localhost:3001/api/auth/login', {
          email: user.email,
          password: user.password
        });
        
        console.log('✅ Login successful!');
        console.log('User ID:', response.data.user.id);
        console.log('User Type:', response.data.user.userType);
        console.log('Name:', response.data.user.firstName, response.data.user.lastName);
        console.log('Token received:', response.data.token ? 'Yes' : 'No');
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('❌ Login failed: Invalid credentials');
        } else {
          console.log('❌ Login failed:', error.response?.data?.error || error.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Server is not running. Please start the server with: node server.js');
    }
  }
}

testRealUsers(); 