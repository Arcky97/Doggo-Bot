import { Client, GuildBan, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler';
import { setBotStats } from '../../managers/botStatsManager';

export default async (ban) => {
  const guildId = ban.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'guildBanAdd' });

    const logChannel = await getLogChannel(guildId, 'member');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'member', cat: 'bans', option: 'adds'});
    if (!configLogging) return;

    let embed = new EmbedBuilder()
      .setColor('Red')
      .setAuthor({
        name: ban.user.globalName,
        iconURL: ban.user.avatarURL()
      })
      .setTitle('Member Banned')
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
    console.error('Failed to log Member Ban!', error);
  }
}