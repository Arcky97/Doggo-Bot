const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, emoji) => {
  try {
    const logChannel = await getLogChannel(client, emoji.guild.id, 'server');
    if (!logChannel) return;
    console.log(emoji);
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

    console.log(`Emoji ${emoji.name} with ID: ${emoji.id} was deleted in Server ${emoji.guild.id}.`);
  } catch (error) {
    console.error('Failed to log Emoji Delete!', error);
  }
}