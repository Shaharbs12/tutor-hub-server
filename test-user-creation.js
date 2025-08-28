const { User } = require('./models');
const { sequelize } = require('./config/database');

async function testUserCreation() {
  try {
    console.log('🔍 Testing user creation...');
    
    // Test data
    const testUser = {
      email: 'test@example.com',
      passwordHash: 'testpassword123',
      firstName: 'Test',
      lastName: 'User',
      userType: 'student',
      phone: '1234567890',
      city: 'Test City',
      languagePreference: 'en'
    };
    
    console.log('📝 Attempting to create user with data:', {
      ...testUser,
      passwordHash: '[HIDDEN]'
    });
    
    // Try to create the user
    const user = await User.create(testUser);
    
    console.log('✅ User created successfully!');
    console.log('👤 User ID:', user.id);
    console.log('📧 Email:', user.email);
    console.log('🔐 Password hash length:', user.passwordHash.length);
    
    // Try to find the user
    const foundUser = await User.findOne({ where: { email: 'test@example.com' } });
    if (foundUser) {
      console.log('✅ User found in database!');
    } else {
      console.log('❌ User not found in database!');
    }
    
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testUserCreation(); 