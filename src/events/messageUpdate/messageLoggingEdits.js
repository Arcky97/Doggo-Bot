const { Client, Message, EmbedBuilder } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData');

module.exports = async (client, oldMessage, newMessage) => {
  if (!oldMessage.inGuild() || oldMessage.author.bot) return;

  try {
    const messageLogChannelId = await selectData('GuildSettings', { guildId: oldMessage.guild.id });

    if (!messageLogChannelId || !messageLogChannelId.messageLogging) return;

    const logChannel = client.channels.cache.get(messageLogChannelId.messageLogging);
    
    if (!logChannel) return;

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
      .setDescription(`**Before:** ${oldContent}\n**After+:** ${newContent}`)
      .setTimestamp()
      .setFooter({
        text: `User ID: ${oldMessage.author.id}`
      });

      await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}