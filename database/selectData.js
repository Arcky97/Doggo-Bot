const { query, getSetting } = require('./db'); // Import the query function

async function getChannel(guildId, settingName) {

  const column = getSetting(settingName);
  if(!column) return;

  const selectQuery = `
    SELECT ${column} 
    FROM GuildSettings 
    WHERE guildId = ?
  `;

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
