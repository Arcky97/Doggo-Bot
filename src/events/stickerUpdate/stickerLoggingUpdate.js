import { Client, Sticker, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (oldSticker, newSticker) => {
  const guildId = oldSticker.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'stickerUpdate' });
    
    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'stickers', option: 'updates' });
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Sticker Updated')
      
    let beforeSettings = afterSettings = '';
    if (oldSticker.name !== newSticker.name) {
      beforeSettings += `**Name:** ${oldSticker.name}`;
      afterSettings += `**Name:** ${newSticker.name}`;
    }

    if (oldSticker.description !== newSticker.description) {
      beforeSettings += `**Description:** \n${oldSticker.description}`;
      afterSettings += `**Description:** \n${newSticker.description}`;
    }

    if (beforeSettings !== '' || afterSettings !== '') {
      embed.addFields(
        {
          name: 'Before',
          value: afterSettings || 'nothing',
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
      text: `Sticker ID: ${oldSticker.id}`
    })
    .setTimestamp()

    if (embed.addFields.length < 1) return;

    await eventTimeoutHandler('server', oldSticker.id, embed, logChannel);
    
  } catch (error) {
    console.error('Failed to log Sticker Update!', error);
  }
}