const mysql = require('mysql2/promise');

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  console.log(`Database ${process.env.DB_NAME} created or already exists.`);

  // Connect to the newly created database to create tables
  await connection.changeUser({ database: process.env.DB_NAME });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table users created or already exists.');
  await connection.end();
}

initializeDatabase().catch(err => {
  console.error('Error creating database:', err.message);
  process.exit(1);
}); 