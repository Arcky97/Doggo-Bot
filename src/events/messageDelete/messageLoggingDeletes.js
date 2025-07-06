import { EmbedBuilder } from "discord.js";
import getLogChannel from "../../managers/logging/getLogChannel.js";
import truncateText from "../../utils/truncateText.js";
import ignoreLogging from "../../managers/logging/ignoreLogging.js";
import eventTimeoutHandler from "../../handlers/eventTimeoutHandler.js";
import checkLogTypeConfig from "../../managers/logging/checkLogTypeConfig.js";
import { setBotStats } from "../../managers/botStatsManager.js";

export default async (message) => {
  if (!message.inGuild() || !message.author || message.author.bot) return;
  
  const guildId = message.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'messageDelete' });

    const logChannel = await getLogChannel(guildId, 'message');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'message', option: 'deletes' });
    if (!configLogging) return;
    
    if (await ignoreLogging(guildId, message.channel.id)) return;

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