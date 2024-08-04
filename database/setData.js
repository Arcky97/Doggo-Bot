const { query } = require('./db'); // Import the query function
const { insertChannel } = require('./insertData.js');
const { updateChannel } = require('./updateData');

async function setChannel(guildId, settingName, channelId) {
  // First, check if the channel setting already exists

  const columnMapping = {
    'botchat': 'chattingChannel',
    'message-logging': 'messageLogging',
    'member-logging': 'memberLogging',
    'server-logging': 'serverLogging',
    'voice-logging': 'voiceLogging',
    'joinleave-logging': 'joinLeaveLogging'
  };

  const column = columnMapping[settingName];

  const checkQuery = `
    SELECT ${column} FROM GuildSettings WHERE guildId = ?;
  `;

  try {
    const [rows] = await query(checkQuery, [guildId]);

    if (rows.length > 0 && rows[0][column]) {
      // If exists, call updateChannel
      return await updateChannel(guildId, settingName, channelId);
    } else {
      // If not exists, call insertChannel
      return await insertChannel(guildId, settingName, channelId);
    }
  } catch (error) {
    console.error('Error checking channel setting:', error);
  }
}

module.exports = { setChannel };