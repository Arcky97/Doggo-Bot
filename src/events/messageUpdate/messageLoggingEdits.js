const { Client, Message, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const truncateText = require('../../utils/truncateText');
const ignoreLogging = require('../../utils/logging/ignoreLogging');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, oldMessage, newMessage) => {
  if (!oldMessage.inGuild() || 
      !oldMessage.author ||
      oldMessage.author.bot || 
      (
        oldMessage.content === newMessage.content && 
        newMessage.embeds.length > oldMessage.embeds.length
      )
    ) return;

  try {
    const logChannel = await getLogChannel(client, oldMessage.guild.id, 'message');
    if (!logChannel) return;

    if (await ignoreLogging(oldMessage.guild.id, logChannel.id)) return;
    
    const oldContent = await truncateText(oldMessage.content, 1024) || '*No content*';
    const newContent = await truncateText(newMessage.content, 1024) || '*No content*';
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

    await setEventTimeOut('message', 'edit', embed, logChannel);
    
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}