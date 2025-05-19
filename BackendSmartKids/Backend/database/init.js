require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDatabase() {
  // Create connection without database selected
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database ${process.env.DB_NAME} created or already exists.`);
    
    // Set timezone to São Paulo
    await connection.query("SET GLOBAL time_zone = '-03:00'");
    await connection.query("SET time_zone = '-03:00'");
    console.log('Database timezone set to São Paulo (-03:00)');
    
    // Close the connection
    await connection.end();
    
    // Run migrations
    require('./migrate');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase(); 