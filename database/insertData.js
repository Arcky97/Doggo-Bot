const { query } = require('./db'); // Import the query function

async function insertChannel(guildId, settingName, channelId) {
  const columnMapping = {
    'botchat': 'chattingChannel',
    'message-logging': 'messageLogging',
    'member-logging': 'memberLogging',
    'server-logging': 'serverLogging',
    'voice-logging': 'voiceLogging',
    'joinleave-logging': 'joinLeaveLogging'
  };
  const column = columnMapping[settingName];

  if (!column) {
    console.error('Invalid setting name:', settingName);
    return null;
  }

  const insertQuery = `
    INSERT INTO GuildSettings (guildId, ${column})
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE ${column} = VALUES(${column});
  `;

  try {
    await query(insertQuery, [guildId, channelId]);
    console.log('Data inserted successfully.');
    return "inserted"
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

module.exports = { insertChannel };
