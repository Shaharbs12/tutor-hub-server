const { sequelize } = require('./config/database');
const { User, Tutor, Student, Subject } = require('./models');

async function testSubjectTutors() {
  try {
    console.log('Testing subject tutors...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Get subject
    const subject = await Subject.findByPk(1);
    console.log('Subject:', subject ? subject.name : 'Not found');
    
    // Get tutors with subjects
    const tutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        },
        {
          model: Subject,
          as: 'subjects',
          where: { id: 1 },
          through: { attributes: ['skill_level'] }
        }
      ]
    });
    
    console.log('Tutors with Math subject:', tutors.length);
    tutors.forEach(tutor => {
      console.log(`- ${tutor.user?.firstName} ${tutor.user?.lastName}`);
      console.log(`  Subjects: ${tutor.subjects?.map(s => s.name).join(', ')}`);
    });
    
    // Test without subject filter
    const allTutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        },
        {
          model: Subject,
          as: 'subjects',
          through: { attributes: ['skill_level'] }
        }
      ]
    });
    
    console.log('All tutors:', allTutors.length);
    allTutors.forEach(tutor => {
      console.log(`- ${tutor.user?.firstName} ${tutor.user?.lastName}`);
      console.log(`  Subjects: ${tutor.subjects?.map(s => s.name).join(', ')}`);
    });
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testSubjectTutors(); 