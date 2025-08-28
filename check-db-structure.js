const { sequelize } = require('./config/database');

async function checkDbStructure() {
  try {
    console.log('Checking database structure...');
    
    // Check the users table structure
    const [results] = await sequelize.query("PRAGMA table_info(users)");
    console.log('\nUsers table structure:');
    results.forEach(column => {
      console.log(`- ${column.name} (${column.type})`);
    });
    
    // Check a sample user record
    const [userResults] = await sequelize.query("SELECT * FROM users LIMIT 1");
    if (userResults.length > 0) {
      console.log('\nSample user record:');
      console.log(userResults[0]);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDbStructure(); 