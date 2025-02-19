const { Client, GuildBan, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (ban) => {
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