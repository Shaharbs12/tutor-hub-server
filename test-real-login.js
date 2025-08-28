const axios = require('axios');

async function testRealLogin() {
  try {
    console.log('Testing login with real users from database...');
    
    // Test the health endpoint first
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Real users with their new passwords
    const realUsers = [
      { email: 'margarita@tutorhub.com', password: 'margarita123', type: 'tutor', name: 'Ms. Margarita' },
      { email: 'john.student@tutorhub.com', password: 'john123', type: 'student', name: 'John Doe' },
      { email: 'jane.student@tutorhub.com', password: 'jane123', type: 'student', name: 'Jane Smith' },
      { email: 'kozo@gmail.com', password: 'kozo123', type: 'tutor', name: 'kozo ben simon' },
      { email: 'yuvalzi@gmail.com', password: 'yuval123', type: 'student', name: 'Yuval Zirin' }
    ];
    
    console.log(`\nTesting ${realUsers.length} real users with known passwords...`);
    
    for (const user of realUsers) {
      try {
        console.log(`\n--- Testing ${user.type}: ${user.email} ---`);
        console.log('Name:', user.name);
        
        const response = await axios.post('http://localhost:3001/api/auth/login', {
          email: user.email,
          password: user.password
        });
        
        console.log('✅ Login successful!');
        console.log('User ID:', response.data.user.id);
        console.log('User Type:', response.data.user.userType);
        console.log('Name:', response.data.user.firstName, response.data.user.lastName);
        console.log('Token received:', response.data.token ? 'Yes' : 'No');
        
        // Test the token by making a request to get current user
        try {
          const userResponse = await axios.get('http://localhost:3001/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${response.data.token}`
            }
          });
          console.log('✅ Token verification successful');
          console.log('Current user data retrieved successfully');
        } catch (tokenError) {
          console.log('❌ Token verification failed:', tokenError.response?.data?.error || tokenError.message);
        }
        
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

testRealLogin(); 