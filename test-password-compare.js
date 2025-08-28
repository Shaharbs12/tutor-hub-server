const { sequelize } = require('./config/database');
const User = require('./models/User');

async function testPasswordCompare() {
  try {
    console.log('Testing password comparison...');
    
    // Find the test user
    const user = await User.findOne({
      where: { email: 'test@example.com' }
    });
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('✅ Test user found:', user.email);
    console.log('Password hash:', user.passwordHash);
    
    // Test the comparePassword method
    const testPassword = 'password123';
    console.log(`Testing password: ${testPassword}`);
    
    try {
      const isMatch = await user.comparePassword(testPassword);
      console.log('Password comparison result:', isMatch);
      
      if (isMatch) {
        console.log('✅ Password comparison successful!');
      } else {
        console.log('❌ Password comparison failed');
      }
    } catch (error) {
      console.error('❌ Error in password comparison:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testPasswordCompare(); 