import { EmbedBuilder } from "discord.js";
import eventTimeoutHandler from "../handlers/eventTimeoutHandler.js";

async function sendModerationLogEvent (guild, channel, color, title, fields) {
  try {
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`Moderation ${title}`)
      .addFields(fields)
      .setFooter({
        text: guild.name,
        iconURL: typeof guild.iconURL === 'function' ? guild.iconURL() : guild.iconURL || null
      })
      .setTimestamp()
    await eventTimeoutHandler(`moderation`, guild.id, embed, channel);
  } catch (error) {
    console.error('Error while trying to create the Moderation Log Embed');
  }
}

export function createWarningAddLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Red', 'Warning Added', fields);
}
  
export function createWarningRemoveLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Orange', 'Warning Removed', fields)
}

export function createWarningClearLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Yellow', 'Warnings Cleared', fields)
}

export function createMuteLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Red', 'Mute', fields)
}

export function createUnmuteLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Green', 'Unmute', fields)
}
  
export function createTimeoutAddLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Red', 'Timeout Added', fields)
}
  
export function createTimeoutRemoveLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Orange', 'Timeout Removed', fields)
}
  
export function createKickLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Red', 'Kick', fields)
}

export function createVerifyKickLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Red', 'Verification Kick', fields)
}
  
export function createRegularBanLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Red', 'Ban', fields)
}
  
export function createSoftBanLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Yellow', 'Soft Ban', fields)
}
  
export function createTempBanLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Orange', 'Temp Ban', fields)
}
  
export function createUnbanLogEmbed (guild, channel, fields) {
  return sendModerationLogEvent(guild, channel, 'Orange', 'Unban', fields)
} 