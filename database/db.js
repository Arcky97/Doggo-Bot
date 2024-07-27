require('dotenv').config();
const mysql = require('mysql2/promise');

module.exports = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).then(
  () => console.log('Connected to the database succesfully!'
)).catch(
  err => console.error('Error connecting to the database:', err
));