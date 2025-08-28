const { sequelize } = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function verifyPasswordUpdates() {
  try {
    console.log('Verifying password updates...');
    
    // Users that should have been updated
    const updatedUsers = [
      { email: 'margarita@tutorhub.com', expectedPassword: 'margarita123' },
      { email: 'john.student@tutorhub.com', expectedPassword: 'john123' },
      { email: 'jane.student@tutorhub.com', expectedPassword: 'jane123' },
      { email: 'kozo@gmail.com', expectedPassword: 'kozo123' },
      { email: 'yuvalzi@gmail.com', expectedPassword: 'yuval123' }
    ];
    
    for (const userData of updatedUsers) {
      console.log(`\n--- Verifying ${userData.email} ---`);
      
      const user = await User.findOne({ where: { email: userData.email } });
      if (!user) {
        console.log('❌ User not found');
        continue;
      }
      
      console.log('User found:', user.firstName, user.lastName);
      console.log('Password hash:', user.passwordHash);
      
      // Test the expected password
      const isMatch = await bcrypt.compare(userData.expectedPassword, user.passwordHash);
      console.log(`Password "${userData.expectedPassword}" matches:`, isMatch);
      
      if (isMatch) {
        console.log('✅ Password verification successful');
      } else {
        console.log('❌ Password verification failed');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

verifyPasswordUpdates(); 