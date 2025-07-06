import { Client, StageInstance, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (stageInstance) => {
  const guildId = stageInstance.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'stageInstanceDelete' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configlogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'stages', option: 'deletes' });
    if (!configlogging) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Stage Instance Removed')
      .setFields(
        {
          name: 'Stage Channel',
          value: `${stageInstance.channel}`
        },
        {
          name: 'Topic',
          value: stageInstance.topic ? `${stageInstance.topic}` : 'None'
        },
        {
          name: 'Privacy Level',
          value: stageInstance.privacyLevel === 1 ? 'Public' : 'Server Only'
        }
      )
      .setFooter({
        text: `Stage Instance ID: ${stageInstance.id}`
      })
      .setTimestamp()

    await eventTimeoutHandler('server', stageInstance.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Stage Instance Delete', error);
  }
}