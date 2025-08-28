const { sequelize } = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function testExactPassword() {
  try {
    console.log('Testing exact password for john.student@tutorhub.com...');
    
    // Find the user
    const user = await User.findOne({
      where: { email: 'john.student@tutorhub.com' }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('Password hash:', user.passwordHash);
    
    // The original password was "password123" (plain text)
    // Now it's hashed, so we need to test with "password123"
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, user.passwordHash);
    console.log(`Password '${testPassword}' matches:`, isMatch);
    
    if (isMatch) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password is incorrect');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testExactPassword(); 