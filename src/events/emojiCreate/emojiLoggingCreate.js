const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require("../../utils/getLogChannel");
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, emoji) => {
  try {
    const logChannel = await getLogChannel(client, emoji.guild.id, 'server');
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Emoji Created')
      .setFields(
        {
          name: 'Name',
          value: emoji.name
        },
        {
          name: 'Created By',
          value: emoji.author
        }
      )
      .setThumbnail(emoji.url)
      .setFooter({
        text: `Emoji ID: ${emoji.id}`
      })
      .setTimestamp()
    
    await setEventTimeOut('server', emoji.id, embed, logChannel);

    console.log(`A new emoji ${emoji.name} with ID: ${emoji.id} was created in Server ${emoji.guild.id}`);
  } catch (error) {
    console.error('Failed to log Emoji Create!', error);
  }
}