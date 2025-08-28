const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    // Test the health endpoint first
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test login with invalid credentials
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ Login should have failed but succeeded:', loginResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Login correctly rejected invalid credentials');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // Test with valid credentials (using new test user)
    try {
      const validLoginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Login successful:', validLoginResponse.data);
    } catch (error) {
      console.log('❌ Valid login failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Server is not running. Please start the server with: node server.js');
    }
  }
}

testLogin(); 