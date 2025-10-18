import { EmbedBuilder } from "discord.js";
import botActivityService from "../../services/botActivityService.js";
import getLogChannel from "../../managers/logging/getLogChannel.js";
import formatTime from "../../utils/formatTime.js";
import getOrdinalSuffix from "../../utils/getOrdinalSuffix.js";
import { getEventEmbed } from "../../managers/embedDataManager.js";
import { createEventEmbed } from "../../services/embeds/createDynamicEmbed.js";
import eventTimeoutHandler from "../../handlers/eventTimeoutHandler.js";
import checkLogTypeConfig from "../../managers/logging/checkLogTypeConfig.js";
import { getGuildSettings } from "../../managers/guildSettingsManager.js";
import { setBotStats } from "../../managers/botStatsManager.js";
import createMissingPermissionsEmbed from "../../utils/createMissingPermissionsEmbed.js";

export default async (member) => {
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

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'joinLeave', option: 'joins'});

    const guildSettings = await getGuildSettings(guildId);
    const joinRoles = JSON.parse(guildSettings.joinRoles);

    /*const permEmbed = createMissingPermissionsEmbed({channel: member.channel, guild: member.guild }, member, ["ManageRoles"], member.channel);
    if (permEmbed) return await member.channel.send({ embeds: [permEmbed] });*/
    
    if (joinRoles) {
      joinRoles.forEach(role => {
        member.roles.add(role.roleId);
      });
    }
    
    if (logChannel && configLogging) {
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
    }

    await botActivityService('Bot Status Updated');
  } catch (error) {
    console.error('Failed to update Activity!', error)
  }
}