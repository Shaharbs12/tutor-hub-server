const axios = require('axios');

async function testTutorMatching() {
  try {
    console.log('Testing tutor-subject matching API...');
    
    // Test getting tutors for Math (subject ID 1)
    const response = await axios.get('http://localhost:3001/api/tutors/subject/1');
    
    console.log('✅ Math Tutors API Response:');
    console.log('Status:', response.status);
    console.log('Subject:', response.data.subject);
    console.log('Tutors found:', response.data.count);
    
    if (response.data.tutors && response.data.tutors.length > 0) {
      console.log('\n📋 Math Tutors:');
      response.data.tutors.forEach(tutor => {
        const subjectNames = tutor.subjects?.map(s => s.name).join(', ') || 'No subjects';
        console.log(`- ${tutor.user?.firstName} ${tutor.user?.lastName}: ${subjectNames}`);
      });
    } else {
      console.log('❌ No Math tutors found');
    }
    
    // Test getting tutors for English (subject ID 2)
    console.log('\n--- Testing English Tutors ---');
    const englishResponse = await axios.get('http://localhost:3001/api/tutors/subject/2');
    
    console.log('✅ English Tutors API Response:');
    console.log('Subject:', englishResponse.data.subject);
    console.log('Tutors found:', englishResponse.data.count);
    
    if (englishResponse.data.tutors && englishResponse.data.tutors.length > 0) {
      console.log('\n📋 English Tutors:');
      englishResponse.data.tutors.forEach(tutor => {
        const subjectNames = tutor.subjects?.map(s => s.name).join(', ') || 'No subjects';
        console.log(`- ${tutor.user?.firstName} ${tutor.user?.lastName}: ${subjectNames}`);
      });
    } else {
      console.log('❌ No English tutors found');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTutorMatching(); 