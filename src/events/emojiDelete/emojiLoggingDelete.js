const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');

module.exports = async (emoji) => {
  const guildId = emoji.guild.id;
  try {
    const logChannel = await getLogChannel(emoji.guild.id, 'server');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'emojis', option: 'deletes' });
    if (!configLogging) return;
    
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Emoji Removed')
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
    console.error('Failed to log Emoji Delete!', error);
  }
}