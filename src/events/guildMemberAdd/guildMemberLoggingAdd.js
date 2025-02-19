const { EmbedBuilder } = require("discord.js");
const botActivityService = require("../../services/botActivityService");
const getLogChannel = require("../../managers/logging/getLogChannel");
const formatTime = require("../../utils/formatTime");
const getOrdinalSuffix = require("../../utils/getOrdinalSuffix");
const { getEventEmbed } = require("../../managers/embedDataManager");
const { createEventEmbed } = require("../../services/embeds/createDynamicEmbed");
const eventTimeoutHandler = require("../../handlers/eventTimeoutHandler");
const checkLogTypeConfig = require("../../managers/logging/checkLogTypeConfig");
const { getGuildSettings } = require("../../managers/guildSettingsManager.js");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = async (member) => {
  const guildId = member.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'guildMemberAdd' });

    if (member.user.id === client.user.id) return;

    const embedData = await getEventEmbed(guildId, 'welcome');
    if (embedData) {
      const channel = client.channels.cache.get(embedData.channelId);
      const welcome = await createEventEmbed(member, embedData);
      await channel.send({ embeds: [welcome] });
    }

    const logChannel = await getLogChannel(guildId, 'joinleave');
    if(!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'joinLeave', option: 'joins'});
    if (!configLogging) return;

    const guildSettings = getGuildSettings(guildId);
    if (guildSettings.joinRoles) {
      guildSettings.joinRoles.forEach(role => {
        member.roles.add(role);
      });
    }
    
    const userAge = await formatTime(member.user.createdAt);
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setAuthor({
        name: member.user.globalName,
        iconURL: member.user.avatarURL()
      })
      .setTitle(`Member Joined`)
      .setFields(
        {
          name: 'User name',
          value: `<@${member.id}>`
        },
        {
          name: 'Member count',
          value: `${getOrdinalSuffix(member.guild.memberCount)}`
        },
        {
          name: 'Created',
          value: `${userAge} ago`
        }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${member.id}`
      });

    await eventTimeoutHandler('joinleave', member.id, embed, logChannel);
 
    await botActivityService();
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}