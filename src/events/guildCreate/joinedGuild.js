import { Client, Guild, EmbedBuilder } from 'discord.js';
import botActivityService from '../../services/botActivityService.js';
import { setLevelSettings } from '../../managers/levelSettingsManager.js';
import { resetDeletionDate } from '../../tasks/databaseCleanUp.js';
import devServerService from '../../services/devServerService.js';
import formatTime from '../../utils/formatTime.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (guild) => {
  try {
    await setBotStats(guild.id, 'event', { event: 'guildCreate' });

    console.log(`✅ Joined a new guild: ${guild.name} (${guild.id}).`);

    setLevelSettings({ id: guild.id });

    const result = await resetDeletionDate(guild.id);

    if (result) {
      console.log(`Data for guild ${guild.id} is no longer marked for deletion.`);
    } else {
      console.log(`No Data marked for deletion found for guild ${guild.id}`);
    }

    await botActivityService('Bot Status Updated');

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Joined a New Server')
      .setDescription(`Hooray! Doggo Bot has joined a new Server`)
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
          name: 'Server Age',
          value: `${await formatTime(guild.createdAt)}`
        },
        {
          name: 'Members',
          value: `${guild.memberCount}`
        }
      )
      .setFooter({ text: `Server ID: ${guild.id}`})
      .setTimestamp()

    const channel = client.channels.cache.get('1314702619196784743');
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`❌ Failed to join the guild: ${guild.name} (${guild.id}).`, error);
  }
};