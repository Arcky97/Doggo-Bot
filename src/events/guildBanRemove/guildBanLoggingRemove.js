import { Client, GuildBan, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (ban) => {
  const guildId = ban.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'guildBanRemove' });

    const logChannel = await getLogChannel(guildId, 'member');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'member', cat: 'bans', option: 'removes'});
    if (!configLogging) return;

    let embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({
        name: ban.user.globalName,
        iconURL: ban.user.avatarURL()
      })
      .setTitle('Member Unbanned')
      .setFields(
        {
          name: 'Name',
          value: `${ban.user}`
        }
      )
      .setFooter({
        text: `Member ID: ${ban.user.id}`
      })
      .setTimestamp()

    await eventTimeoutHandler('member', ban.user.id, embed, logChannel);
  } catch (error) {
    console.error(error);
  }
}