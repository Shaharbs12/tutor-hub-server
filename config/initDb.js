const { sequelize } = require('./database');
const { User, Subject, Tutor, Student } = require('../models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Force sync (recreate tables)
    await sequelize.sync({ force: true });
    console.log('📊 Database tables created');
    
    // Seed initial data
    await seedSubjects();
    await seedUsers();
    await seedTutorProfiles();
    await seedStudentProfiles();
    await linkTutorSubjects();
    
    // Import and run additional seeders
    const { seedReviews } = require('../../database/seed-reviews');
    const { seedConversations } = require('../../database/seed-conversations');
    
    await seedReviews();
    await seedConversations();
    
    console.log('✅ Database initialized successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const seedSubjects = async () => {
  console.log('📚 Seeding subjects...');
  
  const subjects = [
    {
      name: 'Math',
      nameHe: 'מתמטיקה',
      icon: '📊',
      color: '#4A90E2',
      isActive: true
    },
    {
      name: 'English',
      nameHe: 'אנגלית',
      icon: '📖',
      color: '#F5A623',
      isActive: true
    },
    {
      name: 'Programming',
      nameHe: 'תכנות',
      icon: '💻',
      color: '#7B68EE',
      isActive: true
    },
    {
      name: 'Physics',
      nameHe: 'פיזיקה',
      icon: '⚛️',
      color: '#50E3C2',
      isActive: true
    },
    {
      name: 'Chemistry',
      nameHe: 'כימיה',
      icon: '🧪',
      color: '#BD10E0',
      isActive: true
    },
    {
      name: 'French',
      nameHe: 'צרפתית',
      icon: '🇫🇷',
      color: '#B8E986',
      isActive: true
    }
  ];
  
  await Subject.bulkCreate(subjects);
  console.log(`✅ Created ${subjects.length} subjects`);
};

const seedUsers = async () => {
  console.log('👥 Seeding users...');
  
  const users = [
    // Admin
    {
      email: 'admin@tutorhub.com',
      passwordHash: 'admin123', // Will be hashed by model hook
      userType: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: '000-0000000',
      city: 'AdminCity',
      languagePreference: 'en',
      isActive: true,
      isAdmin: true
    },
    // Tutors
    {
      email: 'margarita@tutorhub.com',
      passwordHash: 'password123', // Will be hashed by model hook
      userType: 'tutor',
      firstName: 'Ms.',
      lastName: 'Margarita',
      phone: '050-1234567',
      city: 'Tel Aviv',
      languagePreference: 'en',
      isActive: true
    },
    {
      email: 'shahrukh@tutorhub.com',
      passwordHash: 'password123',
      userType: 'tutor',
      firstName: 'Mr.',
      lastName: 'Shahrukh',
      phone: '052-9876543',
      city: 'Jerusalem',
      languagePreference: 'en',
      isActive: true
    },
    {
      email: 'max@tutorhub.com',
      passwordHash: 'password123',
      userType: 'tutor',
      firstName: 'Mr.',
      lastName: 'Max',
      phone: '054-5555555',
      city: 'Haifa',
      languagePreference: 'en',
      isActive: true
    },
    // Students
    {
      email: 'john.student@tutorhub.com',
      passwordHash: 'password123',
      userType: 'student',
      firstName: 'John',
      lastName: 'Doe',
      phone: '053-1111111',
      city: 'Tel Aviv',
      languagePreference: 'en',
      isActive: true
    },
    {
      email: 'jane.student@tutorhub.com',
      passwordHash: 'password123',
      userType: 'student',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '058-2222222',
      city: 'Jerusalem',
      languagePreference: 'he',
      isActive: true
    },
    {
      email: 'david.student@tutorhub.com',
      passwordHash: 'password123',
      userType: 'student',
      firstName: 'David',
      lastName: 'Cohen',
      phone: '057-3333333',
      city: 'Haifa',
      languagePreference: 'en',
      isActive: true
    }
  ];
  
  await User.bulkCreate(users);
  console.log(`✅ Created ${users.length} users`);
};

const seedTutorProfiles = async () => {
  console.log('👨‍🏫 Seeding tutor profiles...');
  
  const tutorProfiles = [
    {
      userId: 1, // Margarita
      bio: 'Experienced math tutor with 8 years of teaching experience. I specialize in algebra, calculus, and statistics. My goal is to help students build confidence in mathematics and develop problem-solving skills.',
      experienceYears: 8,
      hourlyRate: 150.00,
      rating: 5.00,
      totalReviews: 45,
      totalStudents: 120,
      isVerified: true,
      availabilitySchedule: {
        monday: ['09:00-12:00', '14:00-18:00'],
        tuesday: ['09:00-12:00', '14:00-18:00'],
        wednesday: ['09:00-12:00', '14:00-18:00'],
        thursday: ['09:00-12:00', '14:00-18:00'],
        friday: ['09:00-12:00'],
        saturday: [],
        sunday: ['10:00-16:00']
      }
    },
    {
      userId: 2, // Shahrukh
      bio: 'Professional English teacher with 5 years of experience. I help students improve their grammar, vocabulary, writing skills, and conversation abilities. I make learning English fun and engaging.',
      experienceYears: 5,
      hourlyRate: 120.00,
      rating: 3.50,
      totalReviews: 28,
      totalStudents: 85,
      isVerified: true,
      availabilitySchedule: {
        monday: ['10:00-13:00', '15:00-19:00'],
        tuesday: ['10:00-13:00', '15:00-19:00'],
        wednesday: ['10:00-13:00', '15:00-19:00'],
        thursday: ['10:00-13:00', '15:00-19:00'],
        friday: ['10:00-13:00'],
        saturday: [],
        sunday: ['11:00-17:00']
      }
    },
    {
      userId: 3, // Max
      bio: 'Software developer and programming instructor with 3 years of teaching experience. I teach Python, JavaScript, web development, and computer science fundamentals. Perfect for beginners and intermediate learners.',
      experienceYears: 3,
      hourlyRate: 200.00,
      rating: 2.00,
      totalReviews: 12,
      totalStudents: 35,
      isVerified: false,
      availabilitySchedule: {
        monday: ['16:00-20:00'],
        tuesday: ['16:00-20:00'],
        wednesday: ['16:00-20:00'],
        thursday: ['16:00-20:00'],
        friday: ['16:00-18:00'],
        saturday: ['10:00-16:00'],
        sunday: ['10:00-16:00']
      }
    }
  ];
  
  await Tutor.bulkCreate(tutorProfiles);
  console.log(`✅ Created ${tutorProfiles.length} tutor profiles`);
};

const seedStudentProfiles = async () => {
  console.log('👨‍🎓 Seeding student profiles...');
  
  const studentProfiles = [
    {
      userId: 4, // John
      gradeLevel: '10th Grade',
      learningGoals: 'Improve math skills for SAT preparation and university admission',
      preferredLearningStyle: 'visual'
    },
    {
      userId: 5, // Jane
      gradeLevel: '12th Grade',
      learningGoals: 'Master English writing and literature analysis for Bagrut exams',
      preferredLearningStyle: 'reading'
    },
    {
      userId: 6, // David
      gradeLevel: 'University',
      learningGoals: 'Learn programming and web development for career change',
      preferredLearningStyle: 'kinesthetic'
    }
  ];
  
  await Student.bulkCreate(studentProfiles);
  console.log(`✅ Created ${studentProfiles.length} student profiles`);
};

const linkTutorSubjects = async () => {
  console.log('🔗 Linking tutors with subjects...');
  
  // Get tutors and subjects
  const tutors = await Tutor.findAll();
  const subjects = await Subject.findAll();
  
  // Create subject map
  const subjectMap = {};
  subjects.forEach(subject => {
    subjectMap[subject.name.toLowerCase()] = subject;
  });
  
  // Link tutors with their subjects
  const margarita = tutors.find(t => t.userId === 1);
  if (margarita) {
    await margarita.addSubjects([
      subjectMap['math'],
      subjectMap['physics']
    ]);
  }
  
  const shahrukh = tutors.find(t => t.userId === 2);
  if (shahrukh) {
    await shahrukh.addSubjects([
      subjectMap['english'],
      subjectMap['french']
    ]);
  }
  
  const max = tutors.find(t => t.userId === 3);
  if (max) {
    await max.addSubjects([
      subjectMap['programming'],
      subjectMap['math']
    ]);
  }
  
  console.log('✅ Linked tutors with subjects');
};

module.exports = { initializeDatabase };