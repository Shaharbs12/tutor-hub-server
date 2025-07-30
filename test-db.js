const { sequelize } = require('./config/database');
const { User, Tutor, Student, Subject } = require('./models');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const tables = await sequelize.showAllSchemas();
    console.log('Tables:', tables);
    
    // Count records
    const userCount = await User.count();
    const tutorCount = await Tutor.count();
    const studentCount = await Student.count();
    const subjectCount = await Subject.count();
    
    console.log(`Users: ${userCount}`);
    console.log(`Tutors: ${tutorCount}`);
    console.log(`Students: ${studentCount}`);
    console.log(`Subjects: ${subjectCount}`);
    
    // Test a simple query
    const tutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }
      ]
    });
    
    console.log('Tutors found:', tutors.length);
    tutors.forEach(tutor => {
      console.log(`- ${tutor.user?.firstName} ${tutor.user?.lastName}`);
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testDatabase(); 