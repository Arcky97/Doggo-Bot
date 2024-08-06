const { query, getSetting } = require('./db'); // Import the query function

async function insertChannel(guildId, settingName, channelId) {
  const column = getSetting(settingName);
  if(!column) return;

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