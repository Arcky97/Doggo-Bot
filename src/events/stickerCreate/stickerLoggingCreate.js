import { Client, Sticker, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (sticker) => {
  const guildId = sticker.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'stickerCreate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'stickers', option: 'creates'});
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Sticker ')
      .setFields(
        {
          name: 'Name',
          value: sticker.name
        },
        {
          name: 'Creator',
          value: `${sticker.user}`
        },
        {
          name: 'Description',
          value: sticker.description ? `${sticker.description}` : 'None'
        }
      )
      .setThumbnail(sticker.url())
      .setFooter({
        text: `Stciker ID: ${sticker.id}`
      })
      .setTimestamp()

    await eventTimeoutHandler('server', sticker.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Sticker Create!', error);
  }
}