const { Client, Guild } = require('discord.js');
const setActivity = require('../../utils/setActivity');
const { setLevelSettings } = require('../../../database/levelSystem/setLevelSettings');
const { resetDeletionDate } = require('../../handlers/dataBaseCleanUp');

module.exports = async (client, guild) => {
  try {
    console.log(`✅ Joined a new guild: ${guild.name} (${guild.id}).`);
    setLevelSettings({ id: guild.id })
    await resetDeletionDate(guild.id);
    console.log(`Data for guild ${guild.id} is no longer marked for deletion.`);
    await setActivity(client);
  } catch (error) {
    console.error(`❌ Failed to join the guild: ${guild.name} (${guild.id}).`, error);
  }
};