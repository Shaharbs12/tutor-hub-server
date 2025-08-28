// db.js
const mysql = require('mysql2');

// Create a connection pool (recommended for multiple queries)
const pool = mysql.createPool({
  host: 'localhost',   // your DB host
  user: 'root',        // your MySQL username
  password: 'root', // your MySQL password
  database: 'tutor_hub', // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
