require('dotenv').config();

console.log('Testing environment variables...');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);

if (!process.env.JWT_SECRET) {
  console.log('❌ JWT_SECRET is not set!');
} else {
  console.log('✅ JWT_SECRET is set');
} 