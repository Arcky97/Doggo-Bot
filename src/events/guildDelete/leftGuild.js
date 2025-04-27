const { Client, Guild, EmbedBuilder } = require('discord.js');
const botActivityService = require('../../services/botActivityService');
const { setDeletionDate } = require('../../tasks/databaseCleanUp');
const moment = require("moment");
const formatTime = require('../../utils/formatTime');
const devServerService = require('../../services/devServerService');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (guild) => {
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() + 11); // 11 days from now
  try {
    await setBotStats(guild.id, 'event', { event: 'guildDelete' });

    console.log(`✅ Left the guild: ${guild.name} (${guild.id}).`);

    await setDeletionDate(guild.id, deletionDate);

    console.log(`Data for guild ${guild.id} marked for deletion on ${deletionDate}`);
    
    await botActivityService('Bot Status Updated');

    const joinedAt = moment(client.joinedAt).format('MMMM Do YYYY, h:mm:ss a');
    const leftAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    const timeSpent = await formatTime(client.joinedAt);
    
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Left a Server')
      .setDescription(`Oh no! Doggo Bot has left a Server`)
      .setFields(
        {
          name: 'Name',
          value: guild.name 
        },
        {
          name: 'Owner',
          value: `<@${guild.ownerId}>`
        },
        {
          name: 'Joined At',
          value: `${joinedAt}`
        },
        {
          name: 'Left At',
          value: `${leftAt}`
        },
        {
          name: 'Time Spent',
          value: `${timeSpent}`
        }
      )
      .setFooter({ text: `Server ID: ${guild.id}`})
      .setTimestamp()
    
    const channelId = '1314702619196784743';

    await devServerService(channelId, { embeds: [embed] });
  } catch (error) {
    console.error(`❌ Failed to be removed from the guild: ${guild.name} (${guild.id}).`, error);
  }
}
