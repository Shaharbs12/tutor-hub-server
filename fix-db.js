const { sequelize } = require('./config/database');

async function fixDatabase() {
  try {
    console.log('Fixing database schema...');
    
    // Update the user_type enum to include 'admin'
    await sequelize.query('ALTER TABLE users MODIFY COLUMN user_type ENUM("student", "tutor", "admin") NOT NULL;');
    console.log('✅ Database schema updated successfully');
    
    // Verify the admin user exists and has correct data
    const { User } = require('./models');
    const adminUser = await User.findOne({ where: { email: 'admin@tutorhub.com' } });
    
    if (adminUser) {
      console.log('✅ Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        userType: adminUser.userType,
        isAdmin: adminUser.isAdmin
      });
    } else {
      console.log('❌ Admin user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase(); 