const { sequelize } = require('./config/database');
const { Op } = require('sequelize');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  try {
    console.log('Fixing passwords in database...');
    
    // Find all users with plain text passwords (not starting with $2a$)
    const users = await User.findAll({
      where: {
        passwordHash: {
          [Op.notLike]: '$2a$%'
        }
      }
    });
    
    console.log(`Found ${users.length} users with plain text passwords`);
    
    for (const user of users) {
      console.log(`Fixing password for ${user.email}...`);
      
      // Hash the plain text password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.passwordHash, salt);
      
      // Update the user with the hashed password
      await user.update({ passwordHash: hashedPassword });
      
      console.log(`✅ Fixed password for ${user.email}`);
    }
    
    console.log('✅ All passwords have been hashed');
    
  } catch (error) {
    console.error('❌ Error fixing passwords:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixPasswords(); 