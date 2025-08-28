const { User, Tutor, Subject, Review } = require('../models');

const seedReviews = async () => {
  console.log('⭐ Seeding reviews...');
  
  try {
    // Get users and tutors
    const students = await User.findAll({ where: { userType: 'student' } });
    const tutors = await Tutor.findAll({ include: ['user'] });
    const subjects = await Subject.findAll();
    
    const reviews = [
      // Reviews for Margarita (Math tutor)
      {
        tutorId: 1,
        studentUserId: students[0].id, // John
        subjectId: subjects.find(s => s.name === 'Math').id,
        rating: 5,
        reviewText: 'Excellent math tutor! Ms. Margarita helped me understand calculus concepts that I was struggling with for months. Highly recommended!',
        isAnonymous: false
      },
      {
        tutorId: 1,
        studentUserId: students[1].id, // Jane
        subjectId: subjects.find(s => s.name === 'Math').id,
        rating: 5,
        reviewText: 'Amazing teacher! Very patient and explains everything clearly. My math grades improved significantly.',
        isAnonymous: false
      },
      {
        tutorId: 1,
        studentUserId: students[2].id, // David
        subjectId: subjects.find(s => s.name === 'Physics').id,
        rating: 5,
        reviewText: 'Great physics tutor as well! Helped me with mechanics and thermodynamics.',
        isAnonymous: true
      },
      
      // Reviews for Shahrukh (English tutor)
      {
        tutorId: 2,
        studentUserId: students[0].id, // John
        subjectId: subjects.find(s => s.name === 'English').id,
        rating: 4,
        reviewText: 'Good English teacher. Helped me improve my writing skills for university applications.',
        isAnonymous: false
      },
      {
        tutorId: 2,
        studentUserId: students[1].id, // Jane
        subjectId: subjects.find(s => s.name === 'English').id,
        rating: 3,
        reviewText: 'Decent tutor but sometimes hard to schedule lessons. Teaching quality is good though.',
        isAnonymous: false
      },
      
      // Reviews for Max (Programming tutor)
      {
        tutorId: 3,
        studentUserId: students[2].id, // David
        subjectId: subjects.find(s => s.name === 'Programming').id,
        rating: 2,
        reviewText: 'Knows programming well but not the best at explaining concepts to beginners. Could be more patient.',
        isAnonymous: false
      },
      {
        tutorId: 3,
        studentUserId: students[0].id, // John
        subjectId: subjects.find(s => s.name === 'Programming').id,
        rating: 2,
        reviewText: 'Teaching style doesn\'t work for me. Moves too fast through topics.',
        isAnonymous: true
      }
    ];
    
    await Review.bulkCreate(reviews);
    console.log(`✅ Created ${reviews.length} reviews`);
    
    // Update tutor ratings based on reviews
    await updateTutorRatings();
    
  } catch (error) {
    console.error('❌ Failed to seed reviews:', error);
    throw error;
  }
};

const updateTutorRatings = async () => {
  console.log('📊 Updating tutor ratings...');
  
  const tutors = await Tutor.findAll({
    include: [{
      model: Review,
      as: 'reviews'
    }]
  });
  
  for (const tutor of tutors) {
    if (tutor.reviews && tutor.reviews.length > 0) {
      const totalRating = tutor.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / tutor.reviews.length;
      
      await tutor.update({
        rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
        totalReviews: tutor.reviews.length
      });
      
      console.log(`   - Updated ${tutor.user?.firstName} ${tutor.user?.lastName}: ${averageRating.toFixed(2)}⭐ (${tutor.reviews.length} reviews)`);
    }
  }
};

module.exports = { seedReviews };