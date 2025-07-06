import { Client, StageInstance, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (oldStageInstance, newStageInstance) => {
  const guildId = oldStageInstance.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'stageInstanceUpdate' });
    
    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'stages', option: 'updates' });
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Stage Instance Updated')

    let beforeSettings = afterSettings = '';
    if (oldStageInstance.channelId !== newStageInstance.channelId) {
      beforeSettings += `**Stage Channel:** \n${oldStageInstance.channel}`;
      afterSettings += `**Stage Channel:** \n${newStageInstance.channel}`;
    }

    if (oldStageInstance.topic !== newStageInstance.topic) {
      beforeSettings += `**Topic:** ${oldStageInstance.topic}`;
      afterSettings += `**Topic:** ${newStageInstance.topic}`;
    }

    if (oldStageInstance.privacyLevel !== newStageInstance.privacyLevel) {
      beforeSettings += `**Privacy Level:** \n${oldStageInstance.privacyLevel}`;
      afterSettings += `**Privacy Level:** \n${newStageInstance.privacyLevel}`;
    }

    if (beforeSettings !== '' || afterSettings !== '') {
      embed.addFields(
        {
          name: 'Before',
          value: beforeSettings || 'nothing',
          inline: true 
        },
        {
          name: 'After',
          value: afterSettings || 'who knows what',
          inline: true 
        }
      );
    }

    embed.setFooter({
      text: `Stage Intance ID: ${oldStageInstance.id}`
    })
    .setTimestamp()

    if (embed.addFields.length < 1) return;
    
    await eventTimeoutHandler('server', oldStageInstance.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Stage Instance Update!', error);
  }
}