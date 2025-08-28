const { sequelize } = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function testCommonPasswords() {
  try {
    console.log('Testing common passwords for real users...');
    
    // Common passwords to test
    const commonPasswords = [
      'password',
      'password123',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password1',
      'admin',
      'user',
      'test',
      'demo',
      'welcome',
      'login',
      'pass',
      '123',
      'user123',
      'admin123'
    ];
    
    // Get a few users to test
    const testUsers = [
      'margarita@tutorhub.com',
      'john.student@tutorhub.com',
      'kozo@gmail.com',
      'yuvalzi@gmail.com'
    ];
    
    for (const email of testUsers) {
      console.log(`\n--- Testing passwords for ${email} ---`);
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log('User not found');
        continue;
      }
      
      console.log('User:', user.firstName, user.lastName);
      console.log('Password hash:', user.passwordHash);
      
      // Test each common password
      for (const password of commonPasswords) {
        try {
          const isMatch = await bcrypt.compare(password, user.passwordHash);
          if (isMatch) {
            console.log(`✅ FOUND PASSWORD: "${password}"`);
            break;
          }
        } catch (error) {
          console.log(`Error testing password "${password}":`, error.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testCommonPasswords(); 