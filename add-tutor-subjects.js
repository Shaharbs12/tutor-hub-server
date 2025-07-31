const { sequelize } = require('./config/database');
const { User, Tutor, Student, Subject } = require('./models');

async function addTutorSubjects() {
  try {
    console.log('Adding subjects to tutors for testing...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Get all tutors
    const tutors = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }
      ]
    });
    
    console.log(`Found ${tutors.length} tutors`);
    
    // Get subjects
    const subjects = await Subject.findAll();
    console.log(`Found ${subjects.length} subjects:`, subjects.map(s => s.name));
    
    // Add subjects to tutors
    for (let i = 0; i < tutors.length; i++) {
      const tutor = tutors[i];
      const subjectIndex = i % subjects.length; // Distribute subjects among tutors
      const subject = subjects[subjectIndex];
      
      // Add subject to tutor
      await tutor.addSubject(subject);
      console.log(`✅ Added ${subject.name} to ${tutor.user?.firstName} ${tutor.user?.lastName}`);
    }
    
    // Verify the assignments
    const tutorsWithSubjects = await Tutor.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        },
        {
          model: Subject,
          as: 'subjects',
          through: { attributes: [] }
        }
      ]
    });
    
    console.log('\n📋 Final tutor-subject assignments:');
    tutorsWithSubjects.forEach(tutor => {
      const subjectNames = tutor.subjects?.map(s => s.name).join(', ') || 'No subjects';
      console.log(`${tutor.user?.firstName} ${tutor.user?.lastName}: ${subjectNames}`);
    });
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

addTutorSubjects(); 