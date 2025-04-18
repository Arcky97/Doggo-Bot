const { Client, Message, EmbedBuilder, GuildWidgetStyle } = require("discord.js");
const getLogChannel = require("../../managers/logging/getLogChannel");
const truncateText = require("../../utils/truncateText");
const ignoreLogging = require("../../managers/logging/ignoreLogging");
const eventTimeoutHandler = require("../../handlers/eventTimeoutHandler");
const checkLogTypeConfig = require("../../managers/logging/checkLogTypeConfig");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = async (message) => {
  if (!message.inGuild() || !message.author || message.author.bot) return;
  
  const guildId = message.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'messageDelete' });

    const logChannel = await getLogChannel(guildId, 'message');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'message', option: 'deletes' });
    if (!configLogging) return;
    
    if (await ignoreLogging(guildId, logChannel.id)) return;

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

    await eventTimeoutHandler('message', 'delete', embed, logChannel);

  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}