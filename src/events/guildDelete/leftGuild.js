const { Client, Guild } = require('discord.js');

module.exports = async (client, guild) => {
  try {
    console.log(`✅ Left the guild: ${guild.name} (${guild.id}).`);
  } catch (error) {
    console.error(`❌ Failed to be removed from the guild: ${guild.name} (${guild.id}).`, error);
  }
}
