const { sequelize } = require('./config/database');
const User = require('./models/User');

async function checkRealPasswords() {
  try {
    console.log('Checking password hashes for real users...');
    
    // Get all users from database
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'userType', 'passwordHash']
    });
    
    console.log(`\nFound ${users.length} users in database:`);
    
    for (const user of users) {
      console.log(`\n--- ${user.userType.toUpperCase()}: ${user.email} ---`);
      console.log('Name:', user.firstName, user.lastName);
      console.log('Password hash:', user.passwordHash);
      
      // Check if password is hashed
      if (user.passwordHash.startsWith('$2a$')) {
        console.log('✅ Password is properly hashed');
      } else {
        console.log('❌ Password is NOT hashed (plain text)');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkRealPasswords(); 