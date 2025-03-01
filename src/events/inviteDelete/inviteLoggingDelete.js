const { Client, Invite, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (invite) => {
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