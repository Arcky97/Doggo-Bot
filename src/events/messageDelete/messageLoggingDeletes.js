const { Client, Message, EmbedBuilder } = require("discord.js");
const { selectData } = require("../../../database/controlData/selectData");

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;
  
  try {
    const messageLogChannelId = await selectData('GuildSettings', { guildId: message.guild.id });

    if (!messageLogChannelId || !messageLogChannelId.messageLogging) return;

    const logChannel = client.channels.cache.get(messageLogChannelId.messageLogging);
    
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('DarkOrange')
      .setAuthor({
        name: message.author.globalName,
        iconURL: message.author.avatarURL()
      })
      .setTitle(`Message deleted in #${message.channel.name}`)
      .setDescription(`**Content:** ${message.content}\n\n**Message ID:** ${message.id}`)
      .setTimestamp()
      .setFooter({
        text: `User ID: ${message.author.id}`
      });

      await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}