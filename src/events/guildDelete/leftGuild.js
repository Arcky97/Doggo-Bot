const { Client, Guild } = require('discord.js');
const setActivity = require('../../utils/setActivity');

module.exports = async (client, guild) => {
  try {
    console.log(`✅ Left the guild: ${guild.name} (${guild.id}).`);
    await setActivity(client);
  } catch (error) {
    console.error(`❌ Failed to be removed from the guild: ${guild.name} (${guild.id}).`, error);
  }
}
