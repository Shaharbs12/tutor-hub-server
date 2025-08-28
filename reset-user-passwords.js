const { sequelize } = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function resetUserPasswords() {
  try {
    console.log('Resetting passwords for real users...');
    
    // Users to reset passwords for
    const usersToReset = [
      { email: 'margarita@tutorhub.com', newPassword: 'margarita123' },
      { email: 'john.student@tutorhub.com', newPassword: 'john123' },
      { email: 'jane.student@tutorhub.com', newPassword: 'jane123' },
      { email: 'kozo@gmail.com', newPassword: 'kozo123' },
      { email: 'yuvalzi@gmail.com', newPassword: 'yuval123' }
    ];
    
    for (const userData of usersToReset) {
      console.log(`\n--- Resetting password for ${userData.email} ---`);
      
      const user = await User.findOne({ where: { email: userData.email } });
      if (!user) {
        console.log('❌ User not found');
        continue;
      }
      
      console.log('User found:', user.firstName, user.lastName);
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.newPassword, salt);
      
      // Update the user's password
      await user.update({ passwordHash: hashedPassword });
      
      console.log(`✅ Password reset successfully`);
      console.log(`New password: ${userData.newPassword}`);
    }
    
    console.log('\n✅ All passwords have been reset!');
    console.log('\nYou can now test login with these credentials:');
    console.log('1. margarita@tutorhub.com / margarita123');
    console.log('2. john.student@tutorhub.com / john123');
    console.log('3. jane.student@tutorhub.com / jane123');
    console.log('4. kozo@gmail.com / kozo123');
    console.log('5. yuvalzi@gmail.com / yuval123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

resetUserPasswords(); 