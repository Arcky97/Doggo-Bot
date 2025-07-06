import { Client, GuildEmoji, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (oldEmoji, newEmoji) => {
  const guildId = oldEmoji.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'emojiUpdate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'emojis', option: 'updates' });
    if(!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Emoji Updated')
      .setFields(
        {
          name: 'Old Name',
          value: oldEmoji.name 
        },
        {
          name: 'New Name',
          value: newEmoji.name 
        }
      )
      .setThumbnail(newEmoji.imageURL())
      .setFooter({
        text: `Emoji ID: ${newEmoji.id}`
      })
      .setTimestamp()

    await eventTimeoutHandler('server', newEmoji.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Emoji Update!', error);
  }
}