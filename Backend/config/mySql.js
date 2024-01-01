var { createPool } = require('mysql');

if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

var pool = createPool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASENAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
  charset: 'utf8mb4',
  timezone: 'UTC',
});

module.exports = pool;
