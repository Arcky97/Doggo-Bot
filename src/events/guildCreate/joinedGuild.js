const { Client, Guild } = require('discord.js');
const setActivity = require('../../utils/setActivity');
const { setLevelSettings } = require('../../../database/levelSystem/setLevelSettings');

module.exports = async (client, guild) => {
  try {
    console.log(`✅ Joined a new guild: ${guild.name} (${guild.id}).`);
    setLevelSettings({ guildId: guild.id })
    await setActivity(client)
  } catch (error) {
    console.error(`❌ Failed to join the guild: ${guild.name} (${guild.id}).`, error);
  }
};