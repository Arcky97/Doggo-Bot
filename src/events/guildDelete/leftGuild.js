import { Client, Guild, EmbedBuilder } from 'discord.js';
import botActivityService from '../../services/botActivityService.js';
import { setDeletionDate } from '../../tasks/databaseCleanUp.js';
import moment from "moment";
import formatTime from '../../utils/formatTime.js';
import devServerService from '../../services/devServerService.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (guild) => {
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
          value: `${timeSpent}` || "Unknown"
        }
      )
      .setFooter({ text: `Server ID: ${guild.id}`})
      .setTimestamp()
    
    const channel = client.channels.cache.get('1314702619196784743');
    if (channel) await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`❌ Failed to be removed from the guild: ${guild.name} (${guild.id}).`, error);
  }
}
