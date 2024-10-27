const { Client, Guild } = require('discord.js');
const setActivity = require('../../utils/setActivity');
const { setDeleteDateGuildSettings } = require('../../../database/guildSettings/setGuildSettings');

module.exports = async (client, guild) => {
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() + 0); // 11 days from now

  try {
    console.log(`✅ Left the guild: ${guild.name} (${guild.id}).`);
    await setDeleteDateGuildSettings(guild.id, deletionDate);
    console.log(`Data for guild ${guild.id} marked for deletion on ${deletionDate}`)
    await setActivity(client);
  } catch (error) {
    console.error(`❌ Failed to be removed from the guild: ${guild.name} (${guild.id}).`, error);
  }
}
