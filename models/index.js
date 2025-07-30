const User = require('./User');
const Subject = require('./Subject');
const Tutor = require('./Tutor');
const Student = require('./Student');
const Review = require('./Review');
const Conversation = require('./Conversation');
const Message = require('./Message');

// Define associations

// User relationships
User.hasOne(Tutor, { foreignKey: 'userId', as: 'tutorProfile' });
Tutor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Many-to-many relationship between Tutors and Subjects
Tutor.belongsToMany(Subject, { 
  through: 'tutor_subjects', 
  foreignKey: 'tutor_id',
  otherKey: 'subject_id',
  as: 'subjects'
});

Subject.belongsToMany(Tutor, { 
  through: 'tutor_subjects', 
  foreignKey: 'subject_id',
  otherKey: 'tutor_id',
  as: 'tutors'
});

// Many-to-many relationship between Students and Subjects (preferred subjects)
Student.belongsToMany(Subject, { 
  through: 'student_subjects', 
  foreignKey: 'student_id',
  otherKey: 'subject_id',
  as: 'preferredSubjects'
});

Subject.belongsToMany(Student, { 
  through: 'student_subjects', 
  foreignKey: 'subject_id',
  otherKey: 'student_id',
  as: 'students'
});

// Review relationships
Tutor.hasMany(Review, { foreignKey: 'tutorId', as: 'reviews' });
Review.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });

User.hasMany(Review, { foreignKey: 'studentUserId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'studentUserId', as: 'student' });

Subject.hasMany(Review, { foreignKey: 'subjectId', as: 'reviews' });
Review.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

// Conversation relationships
User.hasMany(Conversation, { foreignKey: 'studentUserId', as: 'studentConversations' });
User.hasMany(Conversation, { foreignKey: 'tutorUserId', as: 'tutorConversations' });

Conversation.belongsTo(User, { foreignKey: 'studentUserId', as: 'student' });
Conversation.belongsTo(User, { foreignKey: 'tutorUserId', as: 'tutor' });

Subject.hasMany(Conversation, { foreignKey: 'subjectId', as: 'conversations' });
Conversation.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

// Message relationships
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

User.hasMany(Message, { foreignKey: 'senderUserId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderUserId', as: 'sender' });

module.exports = {
  User,
  Subject,
  Tutor,
  Student,
  Review,
  Conversation,
  Message
};