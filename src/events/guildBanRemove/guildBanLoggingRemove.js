const { Client, GuildBan, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, ban) => {
  const guildId = ban.guild.id;
  try {
    const logChannel = await getLogChannel(client, guildId, 'member');
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
        },
        /*{
          name: 'Reason',
          value: ban.reason || 'No Reason given.'
        }*/
      )
      .setFooter({
        text: `Member ID: ${ban.user.id}`
      })
      .setTimestamp()

    await setEventTimeOut('member', ban.user.id, embed, logChannel);
  } catch (error) {
    console.error(error);
  }
}