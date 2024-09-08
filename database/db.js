require('dotenv').config();
const mysql = require('mysql2/promise');

let pool; // Declare a variable to hold the database connection

async function initDatabase() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Connected to the database successfully!');

    //const dropBotRepliesTable = `DROP TABLE IF EXISTS BotReplies`;

    //await pool.query(dropBotRepliesTable);

    //const dropGuildSettingsTable = `DROP TABLE IF EXISTS GuildSettings`;

    //await pool.query(dropGuildSettingsTable);

    //const dropLevelXpRequirements = `DROP TABLE IF EXISTS LevelXpRequirements`;

    //await pool.query(dropLevelXpRequirements);

    //const dropMemberLevelsTable = `DROP TABLE IF EXISTS LevelSystem`;

    //await pool.query(dropMemberLevelsTable);

    //const droplevelSettingsTable = `DROP TABLE IF EXISTS LevelSettings`;

    //await pool.query(droplevelSettingsTable);

    //const dropWelcomeSettingsTable = `DROP TABLE IF EXISTS WelcomeSettings`;

    //await pool.query(dropWelcomeSettingsTable);

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

    const createLevelSystemTable = `
      CREATE TABLE IF NOT EXISTS LevelSystem (
        guildId VARCHAR(100) NOT NULL,
        memberId VARCHAR(100) NOT NULL,
        level INT DEFAULT 0,
        xp INT DEFAULT 0,
        color VARCHAR(10) DEFAULT '#f97316',
        PRIMARY KEY (guildId, memberId)
      );
    `;

    const createBotRepliesTable = `
      CREATE TABLE IF NOT EXISTS BotReplies (
        id VARCHAR(100) NOT NULL,
        triggers VARCHAR(100) NOT NULL,
        responses VARCHAR(100) NOT NULL,
        PRIMARY KEY (id)
      );
    `;

    const createLevelSettingsTable = `
      CREATE TABLE IF NOT EXISTS LevelSettings (
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        levelMultiplier FLOAT DEFAULT 1.0,
        announcementId VARCHAR(100) DEFAULT 'not set',
        announcementPing BOOLEAN DEFAULT false,
        roleMultipliers JSON DEFAULT '[]',
        channelMultipliers JSON DEFAULT '[]',
        blackListRoles JSON DEFAULT '[]',
        blackListChannels JSON DEFAULT '[]',
        xpCooldown INT DEFAULT 30 
      );
    `

    const createLevelXpRequirements = `
      CREATE TABLE IF NOT EXISTS LevelXpRequirements (
        level INT NOT NULL PRIMARY KEY,
        requiredXp INT NOT NULL
      )
    `

    const createWelcomeSettingsTable = `
      CREATE TABLE IF NOT EXISTS WelcomeSettings (
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        channelId VARCHAR(100) DEFAULT 'not set',
        message VARCHAR(1000) DEFAULT 'empty',
        useEmbed BOOLEAN DEFAULT true,
        embedColor VARCHAR(10) '#008000',
        timeStamp BOOLEAN DEFAULT true
      )
    `
    
    await pool.query(createGuildSettingsTable);
    await pool.query(createLevelSystemTable);
    await pool.query(createBotRepliesTable);
    await pool.query(createLevelSettingsTable);
    //await pool.query(createLevelXpRequirements);
    //await pool.query(createWelcomeSettingsTable);
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error initializing the database:', err);
  }
}

// Function to execute queries
async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const rows = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

// Export the functions and connection
module.exports = { initDatabase, query };