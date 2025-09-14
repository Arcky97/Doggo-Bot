import dotenv from 'dotenv';
dotenv.config();
import { createPool } from 'mysql2/promise.js';

let pool; // Declare a variable to hold the database connection

export async function initDatabase() {
  try {
    pool = createPool({
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
    console.log('-----------------------------------');
    console.log('Checking database structure...');

    const desiredTables = {
      GuildSettings: `
        CREATE TABLE IF NOT EXISTS GuildSettings (
          guildId VARCHAR(100) NOT NULL PRIMARY KEY,
          chattingChannel VARCHAR(100) DEFAULT NULL,
          messageLogging VARCHAR(100) DEFAULT NULL,
          messageConfig JSON DEFAULT '{ "all": true, "edits": true, "deletes": true, "bulks": true}',
          memberLogging VARCHAR(100) DEFAULT NULL,
          memberConfig JSON DEFAULT '{ "roles": { "adds": true, "removes": true }, "names": { "users": true, "globals": true, "nicks": true }, "avatars": { "globals": true, "servers": true }, "bans": { "adds": true, "removes": true }, "timeouts": { "adds": true, "removes": true } }',
          serverLogging VARCHAR(100) DEFAULT NULL,
          serverConfig JSON DEFAULT '{ "channels": { "creates": true, "updates": true, "deletes": true }, "roles": { "creates": true, "updates": true, "deletes": true }, "updates": { "all": true }, "emojis": { "creates": true, "updates": true, "deletes": true }, "stickers": { "creates": true, "updates": true, "deletes": true } }',
          voiceLogging VARCHAR(100) DEFAULT NULL,
          voiceConfig JSON DEFAULT '{ "joins": true, "moves": true, "leaves": true, "mutes": true, "unmutes": true, "deafens": true, "undeafens": true }',
          joinLeaveLogging VARCHAR(100) DEFAULT NULL,
          joinLeaveConfig JSON DEFAULT '{ "joins": true, "leaves": true }',
          moderationLogging VARCHAR(100) DEFAULT NULL,
          moderationConfig JSON DEFAULT '{ "warns": { "adds": true, "removes": true, "clears": true }, "mutes": true, "unmutes": true, "timeouts": { "adds": true, "removes": true }, "kicks": true, "bans": { "regulars": true, "softs": true, "temps": true }, "unbans": true }',
          reportLogging VARCHAR(100) DEFAULT NULL,
          ignoreLogging JSON DEFAULT '[]',
          muteRole VARCHAR(100) DEFAULT NULL,
          joinRoles JSON DEFAULT '[]',
          deletionDate TIMESTAMP NULL
        );
      `,
      LevelSystem: `
        CREATE TABLE IF NOT EXISTS LevelSystem (
          guildId VARCHAR(100) NOT NULL,
          memberId VARCHAR(100) NOT NULL,
          level INT DEFAULT 0,
          xp BIGINT DEFAULT 0,
          oldXp BIGINT DEFAULT 0,
          color VARCHAR(10) DEFAULT '#f97316',
          deletionDate TIMESTAMP NULL,
          PRIMARY KEY (guildId, memberId)
        );
      `,
      BotReplies: `
        CREATE TABLE IF NOT EXISTS BotReplies (
          id VARCHAR(100) NOT NULL,
          triggers JSON DEFAULT NULL,
          responses JSON DEFAULT NULL,
          PRIMARY KEY (id)
        );
      `,
      LevelSettings: `
        CREATE TABLE IF NOT EXISTS LevelSettings (
          guildId VARCHAR(100) NOT NULL PRIMARY KEY,
          globalMultiplier INT DEFAULT 100,
          levelRoles JSON DEFAULT '[]',
          roleReplace BOOLEAN DEFAULT false,
          announceChannel VARCHAR(100) DEFAULT 'not set',
          announcePing BOOLEAN DEFAULT false,
          announceDefaultMessage JSON DEFAULT '{ "title": "{user global} leveled up!", "description": "Congrats, {user global}, you leveled up to lv. {level}!", "color": "{user color}", "thumbnailUrl": "{user avatar}", "imageUrl": null, "footer": { "text": "{server name}", "iconUrl": "{server icon}" }, "timeStamp": true }',
          announceLevelMessages JSON DEFAULT '[]',
          roleMultipliers JSON DEFAULT '[]',
          channelMultipliers JSON DEFAULT '[]',
          categoryMultipliers JSON DEFAULT '[]',
          multiplierReplace JSON DEFAULT '{ "category": true, "channel": true }',
          blackListRoles JSON DEFAULT '[]',
          blackListChannels JSON DEFAULT '[]',
          blackListCategories JSON DEFAULT '[]',
          xpCooldown INT DEFAULT 30,
          xpSettings JSON DEFAULT '{ "step": 40, "min": 15, "max": 25, "minLength": 15, "maxLength": 115 }',
          xpType enum('random', 'length') DEFAULT 'random',
          clearOnLeave BOOLEAN DEFAULT false,
          voiceEnable BOOLEAN DEFAULT false,
          voiceMultiplier INT DEFAULT 1,
          voiceCooldown INT DEFAULT 2,
          deletionDate TIMESTAMP NULL
        );
      `,
      EventEmbeds: `
        CREATE TABLE IF NOT EXISTS EventEmbeds (
          guildId VARCHAR(100) NOT NULL,
          channelId VARCHAR(100) DEFAULT NULL,
          type VARCHAR(50) NOT NULL,
          message VARCHAR(2000) DEFAULT NULL,
          color VARCHAR(10) DEFAULT NULL,
          author JSON DEFAULT '{ "name": null, "url": null, "iconUrl": null }',
          title VARCHAR(256) DEFAULT NULL,
          url VARCHAR(512) DEFAULT NULL,
          description VARCHAR(2048) DEFAULT NULL,
          fields JSON DEFAULT NULL,
          imageUrl VARCHAR(512) DEFAULT NULL,
          thumbnailUrl VARCHAR(512) DEFAULT NULL,
          footer JSON DEFAULT '{ "text": null, "iconUrl": null }',
          timeStamp BOOLEAN DEFAULT true,
          deletionDate TIMESTAMP NULL,
          PRIMARY KEY (guildId, type)
        )
      `,
      GeneratedEmbeds: `
        CREATE TABLE IF NOT EXISTS GeneratedEmbeds (
          id INT AUTO_INCREMENT,
          guildId VARCHAR(100) NOT NULL,
          channelId VARCHAR(100) NOT NULL,
          messageId VARCHAR(100) NOT NULL,
          message VARCHAR(2000) DEFAULT NULL,
          color VARCHAR(10) DEFAULT NULL,
          author JSON DEFAULT '{ "name": null, "url": null, "iconUrl": null }',
          title VARCHAR(256) DEFAULT NULL,
          url VARCHAR(512) DEFAULT NULL,
          description VARCHAR(2048) DEFAULT NULL,
          fields JSON DEFAULT NULL,
          imageUrl VARCHAR(512) DEFAULT NULL,
          thumbnailUrl VARCHAR(512) DEFAULT NULL,
          footer JSON DEFAULT '{ "text": null, "iconUrl": null }',
          timeStamp BOOLEAN DEFAULT true,
          deletionDate TIMESTAMP NULL,
          PRIMARY KEY (guildId, id)
        )
      `,
      ReactionRoles: `
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
      `,
      UserStats: `
        CREATE TABLE IF NOT EXISTS UserStats (
          guildId VARCHAR(100) NOT NULL,
          memberId VARCHAR(100) NOT NULL,
          attempts JSON DEFAULT '{ "slap": { }, "kick": { }, "ban": { }, "mute": { }, "warn": { }, "timeout": { } }',
          PRIMARY KEY (guildId, memberId)
        )
      `,
      PremiumUsersAndGuilds: `
        CREATE TABLE IF NOT EXISTS PremiumUsersAndGuilds (
          id VARCHAR(100) NOT NULL PRIMARY KEY,
          type VARCHAR(100) NOT NULL,
          date TIMESTAMP NOT NULL 
        )
      `,
      ModerationLogs: `
        CREATE TABLE IF NOT EXISTS ModerationLogs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          guildId VARCHAR(100) NOT NULL,
          userId VARCHAR(100) NOT NULL,
          modId VARCHAR(100) NOT NULL,
          timeoutId VARCHAR(100) DEFAULT NULL,
          action VARCHAR(100) NOT NULL,
          reason VARCHAR(1024) DEFAULT 'No reason provided.',
          status enum('completed', 'pending', 'scheduled', 'failed') DEFAULT 'completed',
          formatDuration VARCHAR(100) DEFAULT NULL,
          logging BOOLEAN DEFAULT true,
          logChannel VARCHAR(100) DEFAULT NULL,
          date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          endTime TIMESTAMP NULL,
          deletionDate TIMESTAMP NULL,
          INDEX idx_status (status),
          INDEX idx_endTime (endTime)
        )
      `,
      BotStats: `
        CREATE TABLE IF NOT EXISTS BotStats (
          guildId VARCHAR(100) NOT NULL PRIMARY KEY,
          totalCount JSON DEFAULT '0',
          eventCount JSON DEFAULT '{ }',
          commandCount JSON DEFAULT '{ }',
          levelSystemCount JSON DEFAULT '{ "xp": 0, "levels": 0 }',
          deletionDate TIMESTAMP NULL, 
          INDEX idx_guildId (guildId)
        )
      `,
      DoggoBoardSettings: `
        CREATE TABLE IF NOT EXISTS DoggoBoardSettings (
          guildId VARCHAR(100) NOT NULL PRIMARY KEY,
          pinChannel VARCHAR(100) NOT NULL,
          emojiId JSON DEFAULT '[":dog:"]',
          requiredReactions INT DEFAULT 3,
          messageAgeHour INT DEFAULT 1,
          pinAgeDay INT DEFAULT 1,
          updateTimeMin INT DEFAULT 1,
          reactionSettings enum('and', 'or', 'sum') DEFAULT 'or',
          deletionData TIMESTAMP NULL
        )
      `,
      DoggoBoardPins: `
        CREATE TABLE IF NOT EXISTS DoggoBoardPins (
          guildId VARCHAR(100) NOT NULL,
          messageId VARCHAR(100) NOT NULL,
          pinMessageId VARCHAR(100) DEFAULT NULL,
          reactionAmount INT DEFAULT 3,
          deletionData TIMESTAMP NULL,
          PRIMARY KEY (guildId, messageId)
        )
      `
    };
    
    const [currentTables] = await pool.query(
      `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ?`,
      [process.env.DB_NAME]
    );
    
    const currentTableNames = currentTables.map(row => row.TABLE_NAME);

    for (const [tableName, createQuery] of Object.entries(desiredTables)) {
      if (!currentTableNames.includes(tableName)) {
        console.log(`New table "${tableName}" created.`);
        await pool.query(createQuery);
      } else {
        await checkTableUpdates(tableName);
      }
    }

    console.log('Database structure check complete.');
  } catch (err) {
    console.error('Error initializing the database:', err);
  }
  console.log('-----------------------------------');
}

async function checkTableUpdates(tableName) {
  const [columns] = await query(
    `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
    FROM information_schema.columns 
    WHERE table_name = ? AND table_schema = ?`,
    [tableName, process.env.DB_NAME]
  );

  const columnMap = columns.reduce((map, col) => {
    map[col.COLUMN_NAME] = {
      type: col.COLUMN_TYPE,
      nullable: col.IS_NULLABLE === 'YES',
      default: col.COLUMN_DEFAULT
    };
    return map;
  }, {});
  console.log(`No changes made to table "${tableName}".`);
}

// Function to execute queries
export async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const rows = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}