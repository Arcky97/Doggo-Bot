const { Client, Message, EmbedBuilder } = require("discord.js");
const getLogChannel = require("../../utils/getLogChannel");

module.exports = async (client, message) => {
  if (!message.inGuild() || !message.author || message.author.bot) return;
  
  try {
    const channel = await getLogChannel(client, message.guild.id, 'message');
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('DarkOrange')
      .setAuthor({
        name: message.author.globalName,
        iconURL: message.author.avatarURL()
      })
      .setTitle(`Message deleted in #${message.channel.name}`)
      .setFields(
        {
          name: "Content",
          value: message.content || 'empty'
        },
        {
          name: "Message ID",
          value: message.id || 'unknown'
        }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${message.author.id}`
      });

      await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}