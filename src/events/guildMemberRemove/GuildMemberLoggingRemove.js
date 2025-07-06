import { EmbedBuilder } from "discord.js";
import botActivityService from "../../services/botActivityService.js";
import moment from "moment";
import getLogChannel from "../../managers/logging/getLogChannel.js";
import getMemberRoles from "../../managers/logging/getMemberRoles.js";
import formatTime from "../../utils/formatTime.js";
import { getLevelSettings } from "../../managers/levelSettingsManager.js";
import { resetLevelSystem } from "../../managers/levelSystemManager.js";
import { getEventEmbed } from "../../managers/embedDataManager.js";
import { createEventEmbed } from "../../services/embeds/createDynamicEmbed.js";
import eventTimeoutHandler from "../../handlers/eventTimeoutHandler.js";
import checkLogTypeConfig from "../../managers/logging/checkLogTypeConfig.js";
import { setBotStats } from "../../managers/botStatsManager.js";

export default async (member) => {
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

    await botActivityService('Bot Status Updated');
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}