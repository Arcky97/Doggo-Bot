const { query, getSetting } = require('./db'); // Import the query function

async function updateChannel(guildId, settingName, channelId) {
  const column = getSetting(settingName);
  if(!column) return;

  const updateQuery = `
    UPDATE GuildSettings 
    SET ${column} = ? 
    WHERE guildId = ?;
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