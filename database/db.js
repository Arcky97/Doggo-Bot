require('dotenv').config();
const mysql = require('mysql2/promise');

let db; // Declare a variable to hold the database connection

const columnMapping = {
  'botchat': 'chattingChannel',
  'message-logging': 'messageLogging',
  'member-logging': 'memberLogging',
  'server-logging': 'serverLogging',
  'voice-logging': 'voiceLogging',
  'joinleave-logging': 'joinLeaveLogging'
};

async function initDatabase() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log('Connected to the database successfully!');
    const createGuildSettingsTable = `
      CREATE TABLE IF NOT EXISTS GuildSettings (
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        chattingChannel VARCHAR(100),
        messageLogging VARCHAR(100),
        memberLogging VARCHAR(100),
        serverLogging VARCHAR(100),
        voiceLogging VARCHAR(100),
        joinLeaveLogging VARCHAR(100)
      );
    `;

    const createMemberLevelsTable = `
      CREATE TABLE IF NOT EXISTS MemberLevels (
        guildId VARCHAR(100) NOT NULL,
        memberId VARCHAR(100) NOT NULL,
        level INT DEFAULT 1,
        xp INT DEFAULT 0,
        PRIMARY KEY (guildId, memberId)
      );
    `;
    
    await db.query(createGuildSettingsTable);
    await db.query(createMemberLevelsTable);
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error initializing the database:', err);
  }
}

// Function to execute queries
async function query(sql, params) {
  if (!db) {
    throw new Error('Database connection not initialized. Call initDatabase first.');
  }
  return db.execute(sql, params);
}

// Export the functions and connection
module.exports = { initDatabase, query, columnMapping }; // Make sure to export both
