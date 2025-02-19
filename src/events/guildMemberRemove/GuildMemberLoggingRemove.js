const { EmbedBuilder } = require("discord.js");
const botActivityService = require("../../services/botActivityService");
const moment = require("moment");
const getLogChannel = require("../../managers/logging/getLogChannel");
const getMemberRoles = require("../../managers/logging/getMemberRoles");
const formatTime = require("../../utils/formatTime");
const { getLevelSettings } = require("../../managers/levelSettingsManager");
const { resetLevelSystem } = require("../../managers/levelSystemManager");
const { getEventEmbed } = require("../../managers/embedDataManager");
const { createEventEmbed } = require("../../services/embeds/createDynamicEmbed");
const eventTimeoutHandler = require("../../handlers/eventTimeoutHandler");
const checkLogTypeConfig = require("../../managers/logging/checkLogTypeConfig");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = async (member) => {
  const guildId = member.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'guildMemberRemove' });

    if(member.user.id === client.user.id) return;
    
    const embedData = await getEventEmbed(guildId, 'leave');
    if (embedData) {
      const channel = client.channels.cache.get(embedData.channelId);
      const leave = await createEventEmbed(member, embedData);
      await channel.send({ embeds: [leave] });
    }

    const logChannel = await getLogChannel(guildId, 'joinleave');
    if(!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'joinLeave', option: 'leaves' });
    if (!configLogging) return;

    const levelSettings = getLevelSettings(guildId);
    if (levelSettings.clearOnLeave === 1) await resetLevelSystem(guildId, member);
    
    const joinedAt = moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a');
    const leftAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    const timeSpent = await formatTime(member.joinedAt);
    const roles = getMemberRoles(member);
    let roleMentions;
    if (roles.length !== 0) {
      roleMentions = roles.map(roleId => `<@&${roleId}>`);
    } else {
      roleMentions = 'No roles';
    }
    
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setAuthor({
        name: member.user.globalName,
        iconURL: member.user.avatarURL()
      })
      .setTitle(`Member Left`)
      .setFields(
        {
          name: 'User name',
          value: `<@${member.user.id}>`
        },
        {
          name: 'Joined At',
          value: `${joinedAt}`
        },
        {
          name: 'Left At',
          value: `${leftAt}`
        },
        {
          name: 'Time Spent',
          value: `${timeSpent}`
        },
        {
          name: 'roles',
          value: `${roleMentions}`
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