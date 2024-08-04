const { query } = require('./db'); // Import the query function

async function getChannel(guildId, settingName) {
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
    return null; // Return null for invalid setting names
  }

  const selectQuery = `SELECT ${column} FROM GuildSettings WHERE guildId = ?`;

  try {
    const [rows] = await query(selectQuery, [guildId]);

    // Check if any result was returned
    if (rows.length > 0) {
      return rows[0][column]; // Return the specific setting value
    } else {
      console.log('No settings found for the given guild ID.');
      return null; // Return null if no settings were found
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null; // Return null on error
  }
}

module.exports = { getChannel };
