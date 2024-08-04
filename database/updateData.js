const { query } = require('./db'); // Import the query function

async function updateChannel(guildId, settingName, channelId) {
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

  const updateQuery = `UPDATE GuildSettings SET ${column} = ? WHERE guildId = ?;
  `;

  try {
    await query(updateQuery, [channelId, guildId]);
    console.log('Data updated successfully.');
    return "updated"
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

module.exports = { updateChannel };