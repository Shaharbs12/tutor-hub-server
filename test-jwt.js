const jwt = require('jsonwebtoken');
require('dotenv').config();

function testJWT() {
  try {
    console.log('Testing JWT token generation...');
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
    
    const testUser = {
      id: 1,
      email: 'test@example.com',
      userType: 'student',
      isAdmin: false
    };
    
    const token = jwt.sign(
      {
        id: testUser.id,
        email: testUser.email,
        userType: testUser.userType,
        isAdmin: testUser.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    console.log('✅ JWT token generated successfully');
    console.log('Token:', token);
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('Decoded token:', decoded);
    
  } catch (error) {
    console.error('❌ JWT error:', error.message);
  }
}

testJWT(); 