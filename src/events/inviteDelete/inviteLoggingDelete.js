import { Client, Invite, EmbedBuilder } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (invite) => {
  const guildId = invite.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'inviteDelete' });

    const logChannel = await getLogChannel(invite.guild.id, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', option: 'updates'});
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Invite Removed')
      .setFields(
        {
          name: 'URL',
          value: invite.code
        },
        {
          name: 'uses',
          value: invite.uses ? invite.uses : 'none'
        }
      )
      .setTimestamp()

    await eventTimeoutHandler('server', guildId, embed, logChannel);
  } catch (error) {
    console.error('Failed to log Invite Delete!', error);
  }
}