const { sequelize } = require('./config/database');
const User = require('./models/User');

async function checkDatabase() {
  try {
    console.log('Checking database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Check if users table exists and has data
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'userType']
    });
    
    console.log(`📊 Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - ${user.userType}`);
    });
    
    if (users.length === 0) {
      console.log('❌ No users found. Database may need to be seeded.');
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 