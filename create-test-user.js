const { sequelize } = require('./config/database');
const User = require('./models/User');
const Student = require('./models/Student');

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if test user already exists
    const existingUser = await User.findOne({
      where: { email: 'test@example.com' }
    });
    
    if (existingUser) {
      console.log('Test user already exists, deleting...');
      await existingUser.destroy();
    }
    
    // Create new test user
    const user = await User.create({
      email: 'test@example.com',
      passwordHash: 'password123', // Will be hashed by the hook
      firstName: 'Test',
      lastName: 'User',
      userType: 'student',
      phone: '050-1234567',
      city: 'Tel Aviv',
      languagePreference: 'en'
    });
    
    // Create student profile
    await Student.create({
      userId: user.id,
      gradeLevel: '10th Grade',
      learningGoals: 'Test learning goals',
      preferredLearningStyle: 'visual'
    });
    
    console.log('✅ Test user created successfully');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTestUser(); 