const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require("../../utils/logging/getLogChannel");
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const { setBotStats } = require('../../../database/BotStats/setBotStats');

module.exports = async (emoji) => {
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
    
    await setEventTimeOut('server', emoji.id, embed, logChannel);
    
  } catch (error) {
    console.error('Failed to log Emoji Create!', error);
  }
}