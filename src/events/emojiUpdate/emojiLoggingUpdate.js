const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (oldEmoji, newEmoji) => {
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