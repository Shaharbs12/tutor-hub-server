const axios = require('axios');

async function testSimpleAPI() {
  try {
    console.log('Testing basic API endpoints...');
    
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Health endpoint working:', healthResponse.data);
    
    // Test subjects endpoint
    console.log('\n2. Testing subjects endpoint...');
    const subjectsResponse = await axios.get('http://localhost:3001/api/subjects');
    console.log('✅ Subjects endpoint working. Found', subjectsResponse.data.subjects.length, 'subjects');
    
    // Test tutors endpoint
    console.log('\n3. Testing tutors endpoint...');
    const tutorsResponse = await axios.get('http://localhost:3001/api/tutors');
    console.log('✅ Tutors endpoint working. Found', tutorsResponse.data.tutors.length, 'tutors');
    
    // Test tutor-subject endpoint
    console.log('\n4. Testing tutor-subject endpoint...');
    const tutorSubjectResponse = await axios.get('http://localhost:3001/api/tutors/subject/1');
    console.log('✅ Tutor-subject endpoint working. Found', tutorSubjectResponse.data.count, 'tutors for Math');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSimpleAPI(); 