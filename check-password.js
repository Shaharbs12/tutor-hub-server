const { sequelize } = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkPassword() {
  try {
    console.log('Checking password for john.student@tutorhub.com...');
    
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
    
    // Test password comparison
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, user.passwordHash);
    console.log(`Password '${testPassword}' matches:`, isMatch);
    
    // Try different password formats
    const passwords = ['password123', 'password', '123', 'Password123', 'PASSWORD123'];
    for (const pwd of passwords) {
      const match = await bcrypt.compare(pwd, user.passwordHash);
      console.log(`'${pwd}' matches:`, match);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkPassword(); 