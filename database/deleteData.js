const { query } = require('./db'); // Import the query function
const { getSetting } = require('./guildSettings/setGuildSettings');

async function deleteChannel(guildId, settingName) {
  const column = getSetting(settingName);
  if(!column) return;

  const deleteQuery = `
    UPDATE GuildSettings
    SET ${column} = NULL
    WHERE guildId = ?;
  `;

  try {
    const result = await query(deleteQuery, [guildId]);
    if (result[0].affectedRows > 0) {
      console.log(`Channel setting for ${settingName} deleted successfully for guild ${guildId}.`);
      return true;
    } else {
      console.log(`No channel setting found for ${settingName} in guild ${guildId}.`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting channel setting:', error);
    return false;
  }
}

module.exports = { deleteChannel };
