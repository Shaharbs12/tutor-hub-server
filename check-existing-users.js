const { User } = require('./models');
const { sequelize } = require('./config/database');

async function checkExistingUsers() {
  try {
    console.log('🔍 Checking existing users in database...');
    
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'userType', 'created_at']
    });
    
    console.log(`📊 Found ${users.length} users in database:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email}, Name: ${user.firstName} ${user.lastName}, Type: ${user.userType}, Created: ${user.created_at}`);
    });
    
    if (users.length === 0) {
      console.log('📭 No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Run the check
checkExistingUsers(); 