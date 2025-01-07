const { Client, GuildBan, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (ban) => {
  const guildId = ban.guild.id;
  try {
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

      await setEventTimeOut('member', ban.user.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Member Ban!', error);
  }
}