import { Client, Invite, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import convertNumberInTime from '../../utils/convertNumberInTime.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (invite) => {
  const guildId = invite.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'inviteCreate' });
    
    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', option: 'updates' });
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('New Invite Created')
      .setFields(
        {
          name: 'Created By',
          value: `${invite.inviter}`
        },
        {
          name: 'URL',
          value: invite.url
        },
        {
          name: 'Expire After',
          value: invite.maxAge !== 0 ? convertNumberInTime(invite.maxAge, 'Seconds') : 'never'
        },
        {
          name: 'Max Uses',
          value: invite.maxUses !== 0 ? `${invite.maxUses}` : 'No limit'
        }
      )
      .setTimestamp()

    await eventTimeoutHandler('server', guildId, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Invite Create!', error);
  }
}