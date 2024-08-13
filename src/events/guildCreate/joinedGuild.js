const { Client, Guild } = require('discord.js');

module.exports = async (guild) => {
  try {
    console.log(`✅ Joined a new guild: ${guild.name} (${guild.id}).`);
  } catch (error) {
    console.error(`❌ Failed to join the guild: ${guild.name} (${guild.id}).`, error);
  }
};