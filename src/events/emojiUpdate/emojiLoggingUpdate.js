const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');

module.exports = async (oldEmoji, newEmoji) => {
  const guildId = oldEmoji.guild.id;
  try {
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

    await setEventTimeOut('server', newEmoji.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Emoji Update!', error);
  }
}