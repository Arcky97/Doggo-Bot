const { Client, Message, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldMessage, newMessage) => {
  if (!oldMessage.inGuild() || oldMessage.author.bot) return;

  try {
    const channel = await getLogChannel(client, oldMessage.guild.id, 'message');
    if (!channel) return;

    const oldContent = oldMessage.content || '*No content*';
    const newContent = newMessage.content || '*No content*';
    
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setAuthor({
        name: oldMessage.author.globalName,
        iconURL: oldMessage.author.avatarURL()
      })
      .setTitle(`Message edited in #${oldMessage.channel.name}`)
      .setURL(`https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channelId}/${oldMessage.id}`)
      .setFields(
        {
          name: 'Before:',
          value: oldContent
        },
        {
          name: 'After:',
          value: newContent
        }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${oldMessage.author.id}`
      });

      await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}