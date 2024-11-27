const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, oldEmoji, newEmoji) => {
  try {
    const logChannel = await getLogChannel(client, oldEmoji.guild.id, 'server');
    if (!logChannel) return;

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