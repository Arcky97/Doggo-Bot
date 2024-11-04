const { Client, Message, EmbedBuilder, GuildWidgetStyle } = require("discord.js");
const getLogChannel = require("../../utils/getLogChannel");
const truncateText = require("../../utils/truncateText");
const ignoreLogging = require("../../utils/ignoreLogging");

module.exports = async (client, message) => {
  if (!message.inGuild() || !message.author || message.author.bot) return;
  
  try {
    const channel = await getLogChannel(client, message.guild.id, 'message');
    if (!channel) return;

    if (await ignoreLogging(message.guild.id, channel.id)) return;

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
          value: await truncateText(message.content, 1024) || 'empty'
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