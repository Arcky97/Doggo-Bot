const { Client, Invite, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (invite) => {
  const guildId = invite.guild.id;
  try {
    const logChannel = await getLogChannel(invite.guild.id, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', option: 'updates'});
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Invite Removed')
      .setFields(
        {
          name: 'url',
          value: invite.code
        },
        {
          name: 'uses',
          value: invite.uses ? invite.uses : 'none'
        }
      )
      .setTimestamp()

    await setEventTimeOut('server', guildId, embed, logChannel);
  } catch (error) {
    console.error('Failed to log Invite Delete!', error);
  }
}