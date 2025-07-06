import { Client, GuildEmoji, EmbedBuilder } from 'discord.js';
import getLogChannel from "../../managers/logging/getLogChannel.js";
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (emoji) => {
  const guildId = emoji.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'emojiCreate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;
    
    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'emojis', option: 'creates' });
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Emoji Created')
      .setFields(
        {
          name: 'Name',
          value: emoji.name
        }
      )
      .setThumbnail(emoji.imageURL())
      .setFooter({
        text: `Emoji ID: ${emoji.id}`
      })
      .setTimestamp()
    
    await eventTimeoutHandler('server', emoji.id, embed, logChannel);
    
  } catch (error) {
    console.error('Failed to log Emoji Create!', error);
  }
}