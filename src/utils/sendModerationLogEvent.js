const { EmbedBuilder } = require("discord.js");
const setEventTimeOut = require("../handlers/setEventTimeOut");

async function sendModerationLogEvent (guild, channel, color, title, fields) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .addFields(fields)
    .setFooter({
      text: guild.name,
      iconURL: guild.iconURL()
    })
    .setTimestamp()
  await setEventTimeOut(`moderation`, guild.id, embed, channel);
}

module.exports = {
  createWarningAddLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Red', 'Warning Added', fields),
  createWarningRemoveLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Orange', 'Warning Removed', fields),
  createWarningClearLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Yellow', 'Warnings Cleared', fields),
  createMuteLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Red', 'Mute', fields),
  createUnmuteLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Green', 'Unmute', fields),
  createTimeoutAddLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Red', 'Timeout Added', fields),
  createTimeoutRemoveLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Orange', 'Timeout Removed', fields),
  createKickLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Red', 'Kick', fields),
  createRegularBanLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Red', 'Ban', fields),
  createSoftBanLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Yellow', 'Soft Ban', fields),
  createTempBanLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Orange', 'Temp Ban', fields),
  createUnbanLogEmbed: (guild, channel, fields) => sendModerationLogEvent(guild, channel, 'Orange', 'Unban', fields) 
}