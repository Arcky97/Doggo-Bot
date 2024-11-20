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

    console.log('Connected to the database!');

    //const editLevelSettingsTable = `ALTER TABLE LevelSettings CHANGE COLUMN announceLevelMessages TEXT AFTER announceDefaultMessage;`;
    //await pool.query(editLevelSettingsTable);

    //const editTable = `ALTER TABLE LevelSettings MODIFY announceDefaultMessage JSON DEFAULT '{ "title": "{user global} leveled up!}", "description": "Congrats, {user global}, you leveled up to lv. {level}!", "color": "{user color}", "thumbnailUrl": "{user avatar}", "imageURL": null, "footer": { "text": "{server name}", "iconUrl": "{server icon}" }, "timeStamp": true }'`;
    //const editTable = `ALTER TABLE LevelSettings MODIFY categoryMultipliers JSON DEFAULT '[]'`;
    //const editTable = `ALTER TABLE LevelSettings CHANGE COLUMN xpSettings xpSettings JSON AFTER xpCooldown;`;
    //await pool.query(editTable);

    //const dropBotRepliesTable = `DROP TABLE IF EXISTS BotReplies;`;
    //await pool.query(dropBotRepliesTable);

    //const dropGuildSettingsTable = `DROP TABLE IF EXISTS GuildSettings;`;
    //await pool.query(dropGuildSettingsTable);

    //const dropLevelXpRequirements = `DROP TABLE IF EXISTS LevelXpRequirements;`;
    //await pool.query(dropLevelXpRequirements);

    //const dropMemberLevelsTable = `DROP TABLE IF EXISTS LevelSystem;`;
    //await pool.query(dropMemberLevelsTable);

    //const droplevelSettingsTable = `DROP TABLE IF EXISTS LevelSettings;`;
    //await pool.query(droplevelSettingsTable);

    //onst dropEventsEmbedsTable = `DROP TABLE IF EXISTS EventEmbeds;`;
    //await pool.query(dropEventsEmbedsTable);

    //const dropGeneratedEmbedsTable = `DROP TABLE IF EXISTS GeneratedEmbeds;`;
    //await pool.query(dropGeneratedEmbedsTable);

    //const dropReactionRolesTable = `DROP TABLE IF EXISTS ReactionRoles;`;
    //await pool.query(dropReactionRolesTable);

    //const dropUserStatsTable = `DROP TABLE IF EXISTS UserStats;`;
    //await pool.query(dropUserStatsTable);

    const createGuildSettingsTable = `
      CREATE TABLE IF NOT EXISTS GuildSettings (
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        chattingChannel VARCHAR(100) DEFAULT NULL,
        messageLogging VARCHAR(100) DEFAULT NULL,
        memberLogging VARCHAR(100) DEFAULT NULL,
        serverLogging VARCHAR(100) DEFAULT NULL,
        voiceLogging VARCHAR(100) DEFAULT NULL,
        joinLeaveLogging VARCHAR(100) DEFAULT NULL,
        reportLogging VARCHAR(100) DEFAULT NULL,
        ignoreLogging JSON DEFAULT '[]',
        muteRole VARCHAR(100) DEFAULT NULL,
        deletionDate TIMESTAMP NULL
      );
    `;

    const createLevelSystemTable = `
      CREATE TABLE IF NOT EXISTS LevelSystem (
        guildId VARCHAR(100) NOT NULL,
        memberId VARCHAR(100) NOT NULL,
        level INT DEFAULT 0,
        xp INT DEFAULT 0,
        color VARCHAR(10) DEFAULT '#f97316',
        deletionDate TIMESTAMP NULL,
        PRIMARY KEY (guildId, memberId)
      );
    `;

    const createBotRepliesTable = `
      CREATE TABLE IF NOT EXISTS BotReplies (
        id VARCHAR(100) NOT NULL,
        triggers JSON DEFAULT NULL,
        responses JSON DEFAULT NULL,
        PRIMARY KEY (id)
      );
    `;

    const createLevelSettingsTable = `
      CREATE TABLE IF NOT EXISTS LevelSettings (
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        globalMultiplier INT DEFAULT 100,
        levelRoles JSON DEFAULT '[]',
        roleReplace BOOLEAN DEFAULT false,
        announceChannel VARCHAR(100) DEFAULT 'not set',
        announcePing BOOLEAN DEFAULT false,
        announceDefaultMessage JSON DEFAULT '{ "title": "{user global} leveled up!}", "description": "Congrats, {user global}, you leveled up to lv. {level}!", "color": "{user color}", "thumbnailUrl": "{user avatar}", "imageURL": null, "footer": { "text": "{server name}", "iconUrl": "{server icon}" }, "timeStamp": true }',
        announceLevelMessages JSON DEFAULT '[]',
        roleMultipliers JSON DEFAULT '[]',
        channelMultipliers JSON DEFAULT '[]',
        categoryMultipliers JSON DEFAULT '[]',
        blackListRoles JSON DEFAULT '[]',
        blackListChannels JSON DEFAULT '[]',
        blackListCategories JSON DEFAULT '[]',
        xpCooldown INT DEFAULT 30,
        xpSettings JSON DEFAULT '{ "step": 40, "min": 15, "max": 25 }',
        clearOnLeave BOOLEAN DEFAULT false,
        voiceEnable BOOLEAN DEFAULT false,
        voiceMultiplier INT DEFAULT 1,
        voiceCooldown INT DEFAULT 2,
        deletionDate TIMESTAMP NULL
      );
    `;

    const createLevelXpRequirements = `
      CREATE TABLE IF NOT EXISTS LevelXpRequirements (
        level INT NOT NULL PRIMARY KEY,
        requiredXp INT NOT NULL
      )
    `;

    const createEventEmbedsTable = `
      CREATE TABLE IF NOT EXISTS EventEmbeds (
        guildId VARCHAR(100) NOT NULL,
        channelId VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        message VARCHAR(2000) DEFAULT NULL,
        color VARCHAR(10) DEFAULT NULL,
        author VARCHAR(256) DEFAULT NULL,
        authorUrl VARCHAR(512) DEFAULT NULL,
        authorIconUrl VARCHAR(512) DEFAULT NULL,
        title VARCHAR(256) DEFAULT NULL,
        titleUrl VARCHAR(512) DEFAULT NULL,
        description VARCHAR(2048) NOT NULL,
        fields JSON DEFAULT NULL,
        imageUrl VARCHAR(512) DEFAULT NULL,
        thumbnailUrl VARCHAR(512) DEFAULT NULL,
        footer VARCHAR(2048) DEFAULT NULL,
        footerIconUrl VARCHAR(512) DEFAULT NULL,
        timeStamp BOOLEAN DEFAULT true,
        deletionDate TIMESTAMP NULL,
        PRIMARY KEY (guildId, channelId, type)
      )
    `;

    const createGeneratedEmbedsTable = `
      CREATE TABLE IF NOT EXISTS GeneratedEmbeds (
        guildId VARCHAR(100) NOT NULL,
        channelId VARCHAR(100) NOT NULL,
        messageId VARCHAR(100) NOT NULL,
        message VARCHAR(2000) DEFAULT NULL,
        color VARCHAR(10) DEFAULT NULL,
        author VARCHAR(256) DEFAULT NULL,
        authorUrl VARCHAR(512) DEFAULT NULL,
        authorIconUrl VARCHAR(512) DEFAULT NULL,
        title VARCHAR(256) NOT NULL,
        titleUrl VARCHAR(512) DEFAULT NULL,
        description VARCHAR(2048) NOT NULL,
        fields JSON DEFAULT NULL,
        imageUrl VARCHAR(512) DEFAULT NULL,
        thumbnailUrl VARCHAR(512) DEFAULT NULL,
        footer VARCHAR(2048) DEFAULT NULL,
        footerIconUrl VARCHAR(512) DEFAULT NULL,
        timeStamp BOOLEAN DEFAULT true,
        deletionDate TIMESTAMP NULL,
        PRIMARY KEY (guildId, channelId, messageId)
      )
    `;

    const createReactionRolesTable = `
      CREATE TABLE IF NOT EXISTS ReactionRoles (
        guildId VARCHAR(100) NOT NULL,
        channelId VARCHAR(100) NOT NULL,
        messageId VARCHAR(100) NOT NULL,
        emojiRolePairs JSON DEFAULT NULL,
        maxRoles INT DEFAULT 0,
        maxReactions INT DEFAULT 0,
        type VARCHAR(100) DEFAULT 'normal',
        deletionDate TIMESTAMP NULL,
        PRIMARY KEY (guildId, channelId, messageId)
      )
    `;

    const createUserStatsTable = `
      CREATE TABLE IF NOT EXISTS UserStats (
        guildId VARCHAR(100) NOT NULL,
        memberId VARCHAR(100) NOT NULL,
        attempts JSON DEFAULT '{ "slap": { "client": 0, "owner": 0, "self": 0, "admins": {}, "members": {}, "bots": {} }, "kick": { "client": 0, "owner": 0, "self": 0, "admins": {}, "members": {}, "bots": {} }, "ban": { "client": 0, "owner": 0, "self": 0, "admins": {}, "members": {}, "bots": {} }, "mute": { "client": 0, "owner": 0, "self": 0, "admins": {}, "members": {}, "bots": {} }}',
        PRIMARY KEY (guildId, memberId)
      )
    `;
    
    await pool.query(createGuildSettingsTable);
    await pool.query(createLevelSystemTable);
    await pool.query(createBotRepliesTable);
    await pool.query(createLevelSettingsTable);
    //await pool.query(createLevelXpRequirements);
    await pool.query(createEventEmbedsTable);
    await pool.query(createGeneratedEmbedsTable);
    await pool.query(createReactionRolesTable);
    await pool.query(createUserStatsTable);
    console.log('Tables Created!');
  } catch (err) {
    console.error('Error initializing the database:', err);
  }
  console.log('-----------------------------------');
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