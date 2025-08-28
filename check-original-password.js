const { sequelize } = require('./config/database');

async function checkOriginalPassword() {
  try {
    console.log('Checking original password data...');
    
    // Query the database directly to see what was stored
    const [results] = await sequelize.query(
      "SELECT email, password_hash FROM users WHERE email = 'john.student@tutorhub.com'"
    );
    
    if (results.length > 0) {
      const user = results[0];
      console.log('User email:', user.email);
      console.log('Password hash:', user.password_hash);
      
      // Check if it looks like a hash
      if (user.password_hash.startsWith('$2a$')) {
        console.log('✅ Password is properly hashed');
      } else {
        console.log('❌ Password is not hashed (plain text)');
      }
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkOriginalPassword(); 