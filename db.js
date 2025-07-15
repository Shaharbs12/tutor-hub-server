require('dotenv').config();
const mysql = require('mysql2/promise');
require('./create_db');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// CRUD operations for 'users' table
module.exports = {
  // Create a new user
  createUser: async (user) => {
    const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [user.name, user.email, user.password]);
    return { id: result.insertId, ...user };
  },

  // Read all users
  getUsers: async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  },

  // Read a user by ID
  getUserById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // Update a user by ID
  updateUser: async (id, user) => {
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [user.name, user.email, id]);
    return { id, ...user };
  },

  // Delete a user by ID
  deleteUser: async (id) => {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return { id };
  }
}; 