#!/usr/bin/env node

// Database initialization script
const { initializeDatabase } = require('../config/initDb');

async function main() {
  console.log('🚀 Starting database initialization...\n');
  
  try {
    await initializeDatabase();
    console.log('\n🎉 Database initialization completed successfully!');
    
    console.log('\n📋 Summary:');
    console.log('   - 6 subjects created (Math, English, Programming, Physics, Chemistry, French)');
    console.log('   - 6 users created (3 tutors, 3 students)');
    console.log('   - 3 tutor profiles with ratings and availability');
    console.log('   - 3 student profiles with learning preferences');
    console.log('   - Tutor-subject relationships established');
    
    console.log('\n🔐 Test Accounts:');
    console.log('   Tutors:');
    console.log('   - margarita@tutorhub.com (Math, Physics) - 5⭐');
    console.log('   - shahrukh@tutorhub.com (English, French) - 3.5⭐');
    console.log('   - max@tutorhub.com (Programming, Math) - 2⭐');
    console.log('   Students:');
    console.log('   - john.student@tutorhub.com');
    console.log('   - jane.student@tutorhub.com');
    console.log('   - david.student@tutorhub.com');
    console.log('   Password for all accounts: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();