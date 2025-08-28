const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');

async function fixPasswordsDirect() {
  try {
    console.log('Fixing passwords directly in database...');
    
    // Users to update with their new passwords
    const usersToUpdate = [
      { email: 'margarita@tutorhub.com', newPassword: 'margarita123' },
      { email: 'john.student@tutorhub.com', newPassword: 'john123' },
      { email: 'jane.student@tutorhub.com', newPassword: 'jane123' },
      { email: 'kozo@gmail.com', newPassword: 'kozo123' },
      { email: 'yuvalzi@gmail.com', newPassword: 'yuval123' }
    ];
    
    for (const userData of usersToUpdate) {
      console.log(`\n--- Updating password for ${userData.email} ---`);
      
      // Hash the password manually
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.newPassword, salt);
      
      // Update directly in database using raw SQL
      const [result] = await sequelize.query(
        'UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?',
        {
          replacements: [hashedPassword, new Date(), userData.email]
        }
      );
      
      if (result.affectedRows > 0) {
        console.log(`✅ Password updated successfully`);
        console.log(`New password: ${userData.newPassword}`);
      } else {
        console.log(`❌ User not found or update failed`);
      }
    }
    
    console.log('\n✅ All passwords have been updated directly!');
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

fixPasswordsDirect(); 