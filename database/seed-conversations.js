const { User, Tutor, Subject, Conversation, Message } = require('../models');

const seedConversations = async () => {
  console.log('💬 Seeding conversations and messages...');
  
  try {
    // Get users
    const students = await User.findAll({ where: { userType: 'student' } });
    const tutors = await User.findAll({ where: { userType: 'tutor' } });
    const subjects = await Subject.findAll();
    
    // Create conversations
    const conversations = [
      {
        studentUserId: students[0].id, // John
        tutorUserId: tutors[0].id, // Margarita
        subjectId: subjects.find(s => s.name === 'Math').id,
        status: 'active',
        lastMessageAt: new Date('2025-01-20 14:30:00')
      },
      {
        studentUserId: students[1].id, // Jane
        tutorUserId: tutors[1].id, // Shahrukh
        subjectId: subjects.find(s => s.name === 'English').id,
        status: 'active',
        lastMessageAt: new Date('2025-01-21 16:45:00')
      },
      {
        studentUserId: students[2].id, // David
        tutorUserId: tutors[2].id, // Max
        subjectId: subjects.find(s => s.name === 'Programming').id,
        status: 'active',
        lastMessageAt: new Date('2025-01-22 10:15:00')
      }
    ];
    
    const createdConversations = await Conversation.bulkCreate(conversations, {
      returning: true
    });
    console.log(`✅ Created ${createdConversations.length} conversations`);
    
    // Create messages for each conversation
    await seedMessages(createdConversations, students, tutors);
    
  } catch (error) {
    console.error('❌ Failed to seed conversations:', error);
    throw error;
  }
};

const seedMessages = async (conversations, students, tutors) => {
  console.log('💭 Creating sample messages...');
  
  const messages = [];
  
  // Conversation 1: John (student) with Margarita (math tutor)
  const conv1 = conversations[0];
  messages.push(
    {
      conversationId: conv1.id,
      senderUserId: students[0].id, // John
      messageText: 'Hi Ms. Margarita! I need help with calculus derivatives.',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-20 14:00:00')
    },
    {
      conversationId: conv1.id,
      senderUserId: tutors[0].id, // Margarita
      messageText: 'Hello John! I\'d be happy to help you with derivatives. What specific topics are you struggling with?',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-20 14:05:00')
    },
    {
      conversationId: conv1.id,
      senderUserId: students[0].id, // John
      messageText: 'I don\'t understand the chain rule and product rule. Can we schedule a session?',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-20 14:10:00')
    },
    {
      conversationId: conv1.id,
      senderUserId: tutors[0].id, // Margarita
      messageText: 'Of course! How about tomorrow at 3 PM? We can work through several examples together.',
      messageType: 'text',
      isRead: false,
      createdAt: new Date('2025-01-20 14:30:00')
    }
  );
  
  // Conversation 2: Jane (student) with Shahrukh (English tutor)
  const conv2 = conversations[1];
  messages.push(
    {
      conversationId: conv2.id,
      senderUserId: students[1].id, // Jane
      messageText: 'שלום! I need help with English essay writing for my Bagrut exam.',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-21 15:00:00')
    },
    {
      conversationId: conv2.id,
      senderUserId: tutors[1].id, // Shahrukh
      messageText: 'Hello Jane! I can definitely help you with essay writing. What type of essays are you working on?',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-21 15:30:00')
    },
    {
      conversationId: conv2.id,
      senderUserId: students[1].id, // Jane
      messageText: 'Argumentative essays and literature analysis. I struggle with organizing my ideas.',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-21 16:00:00')
    },
    {
      conversationId: conv2.id,
      senderUserId: tutors[1].id, // Shahrukh
      messageText: 'Perfect! Let\'s start with essay structure and then move to analysis techniques. When are you available?',
      messageType: 'text',
      isRead: false,
      createdAt: new Date('2025-01-21 16:45:00')
    }
  );
  
  // Conversation 3: David (student) with Max (programming tutor)
  const conv3 = conversations[2];
  messages.push(
    {
      conversationId: conv3.id,
      senderUserId: students[2].id, // David
      messageText: 'Hi Max, I want to learn web development. Where should I start?',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-22 09:00:00')
    },
    {
      conversationId: conv3.id,
      senderUserId: tutors[2].id, // Max
      messageText: 'Hey David! Great choice. I\'d recommend starting with HTML, CSS, and then moving to JavaScript. Do you have any programming background?',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-22 09:30:00')
    },
    {
      conversationId: conv3.id,
      senderUserId: students[2].id, // David
      messageText: 'I have some basic Python knowledge from university, but that\'s it.',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2025-01-22 10:00:00')
    },
    {
      conversationId: conv3.id,
      senderUserId: tutors[2].id, // Max
      messageText: 'That\'s a good foundation! We can leverage your Python knowledge when we get to backend development.',
      messageType: 'text',
      isRead: false,
      createdAt: new Date('2025-01-22 10:15:00')
    }
  );
  
  await Message.bulkCreate(messages);
  console.log(`✅ Created ${messages.length} messages across ${conversations.length} conversations`);
};

module.exports = { seedConversations };