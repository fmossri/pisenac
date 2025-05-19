require('dotenv').config();
/* const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database/smartkids.db'
  },
  useNullAsDefault: true
  
  }); */

const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4',
    timezone: '-03:00',
    dateStrings: true
  }
});

// Set timezone for all connections
db.raw('SET time_zone = ?', ['-03:00']).then(() => {
  console.log('Database timezone set to -03:00 (São Paulo)');
}).catch(err => {
  console.error('Error setting database timezone:', err);
});

module.exports = db;