const { Client, Message, EmbedBuilder, GuildWidgetStyle } = require("discord.js");
const getLogChannel = require("../../utils/getLogChannel");
const truncateText = require("../../utils/truncateText");
const ignoreLogging = require("../../utils/ignoreLogging");
const setEventTimeOut = require("../../handlers/setEventTimeOut");

module.exports = async (client, message) => {
  if (!message.inGuild() || !message.author || message.author.bot) return;
  
  try {
    const logChannel = await getLogChannel(client, message.guild.id, 'message');
    if (!logChannel) return;

    if (await ignoreLogging(message.guild.id, logChannel.id)) return;

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

    await setEventTimeOut('message', 'delete', embed, logChannel);

  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}