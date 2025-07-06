import { addModerationLogs } from "../../../../managers/moderationLogsManager.js";
import { createInfoEmbed, createErrorEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import convertNumberInTime from "../../../../utils/convertNumberInTime.js";
import calculateEndTime from '../../../../utils/calculateEndTime.js';
import checkLogTypeConfig from "../../../../managers/logging/checkLogTypeConfig.js";
import { createRegularBanLogEmbed, createSoftBanLogEmbed, createTempBanLogEmbed } from "../../../../services/moderationLogService.js";
import { addModerationTask } from "../../../../tasks/moderationTasks.js";
import createMissingPermissionsEmbed from "../../../../utils/createMissingPermissionsEmbed.js";
import getUserClass from "../../../../utils/getUserClass.js";
import getCmdReplyKey from "../../../../utils/getCmdReplyKey.js";
import { updateUserAttempts } from "../../../../managers/userStatsManager.js";
import getCommandReply from "../../../../utils/getCommandReply.js";
import { findJsonFile } from "../../../../managers/jsonDataManager.js";

const commandReplies = findJsonFile('commandReplies.json', 'data');

export default async (interaction, guild, user, mod, reason, nextId, formatDuration, logChannel, beginTime, endTime, durationMs, timeoutUUID, durationToTomorrow, subCmd) => {
  const embeds = [];
  let title, description;
  let fields = [];

  const permEmbed = await createMissingPermissionsEmbed(interaction, mod, ['BanMembers']);
  if (permEmbed) {
    embeds.push(permEmbed);
    return { embeds };
  }

  const member = guild.members.cache.get(user.id);
  const [userClass, targetClass] = getUserClass([{ member: mod, perms: ['BanMembers'] }, { member: member, perms: ['BanMembers'] }]);
  let replies = commandReplies['ban']?.[targetClass]?.[userClass];
  const banKey = getCmdReplyKey(targetClass, mod.id, user?.id) || "user";
  await updateUserAttempts(guild.id, mod.id, user?.id, 'ban', banKey, replies?.length > 1);

  if (!replies) {
    try {
      const time = interaction.options.getString('time')
      const deleteMessagesMs = calculateEndTime(time, true) || 0;
      const deleteMessages = Math.round(deleteMessagesMs / 1000);
      const deleteMessagesFor = deleteMessages !== 0 ? convertNumberInTime(deleteMessages, 'Seconds') : 'Didn\'t delete any';
      const banLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'bans' });
      switch (subCmd) {
        case 'regular':
          const banInfo = await guild.bans.fetch(user.id).catch(() => null);
          if (!banInfo) {
            // Ban User from the Server.
            await addModerationLogs({guildId: guild.id, userId: user.id, modId: mod.id, action: 'ban', reason: reason, logging: banLogging.regulars, date: beginTime});
            title = `Banned ${user.username}`;
            description = `${user} has been Banned!`;
            fields.push({
              name: `ID: ${nextId}`,
              value:  `**User:** ${user}\n` +
                      `**Banned by:** ${mod}\n` +
                      `**Reason:** ${reason}\n` +
                      `**Messages Deleted for:** ${deleteMessagesFor}`
            });
            await guild.members.ban(user.id, { reason: reason, deleteMessageSeconds: deleteMessages });
            if (banLogging.regulars) await createRegularBanLogEmbed(guild, logChannel, fields);  
          } else {
            // User already banned from the Server.
            embeds.push(createInfoEmbed({
              int: interaction,
              title: `${user.username} already banned`,
              descr: `${user} has already been banned from this Server.`
            }));
          }
          break;
        case 'soft':
          const softBanInfo = await guild.members.fetch(user.id).catch(() => null);
          if (softBanInfo) {
            // Soft Ban User in the Server.
            await addModerationLogs({ guildId: guild.id, userId: user.id, modId: mod.id, action: 'ban', reason: reason, logging: banLogging.softs, date: beginTime});
            title = `Soft Banned ${user.username}`;
            description = `${user} has been Soft Banned!`;
            fields.push({
              name: `ID: ${nextId}`,
              value:  `**User:** ${user}\n` +
                      `**Soft Banned by:** ${mod}\n` +
                      `**Reason:** ${reason}\n` +
                      `**Messages Deleted for:** ${deleteMessagesFor}`
            })
            await interaction.guild.members.ban(user.id, { reason: reason, deleteMessageSeconds: deleteMessages });
            await interaction.guild.members.unban(user.id, reason);
            if (banLogging.softs) await createSoftBanLogEmbed(guild, logChannel, fields);
          } else {
            // User is not in the Server.
            embeds.push(createInfoEmbed({
              int: interaction,
              title: `Member not in this Server`,
              descr: `${user} is not in this Server so soft banning won't have any effect. \nUse \`mod ban regular\` or \`mod ban temp\` instead.`
            }));
          }
          break;
        case 'temp':
          const tempBanInfo = await guild.bans.fetch(user.id).catch(() => null);
          const unbanLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'unbans' });
          if (!tempBanInfo) {
            // Temp Ban User from the Server.
            await guild.members.ban(user.id, { reason: reason, deleteMessageSeconds: deleteMessages });
            title = `Temp Banned ${user.username}`;
            description = `${user} has been Temp Banned for ${formatDuration}!`;
            fields.push({
              name: `ID: ${nextId}`,
              value:  `**Member:** ${user}\n` +
                      `**Temp Banned by:** ${mod}\n` +
                      `**Reason:** ${reason}\n` +
                      `**Duration:** ${formatDuration}\n` +
                      `**Messages Deleted For:** ${deleteMessagesFor}`
            });
            if (banLogging.temps) await createTempBanLogEmbed(guild, logChannel, fields);
            await addModerationLogs({ guildId: guild.id, userId: user.id, modId: mod.id, action: 'ban', reason: reason, status: 'pending', formatDuration: formatDuration, logging: banLogging.temps, logChannel: logChannel?.id, date: beginTime, duration: endTime });
            if (durationMs) {
              if (durationMs < durationToTomorrow) {
                await addModerationTask(nextId, timeoutUUID, guild, user, mod.id, durationMs, 'ban', formatDuration, unbanLogging, logChannel, beginTime);
              }
            }
          } else {
            // User already banned from the Server.
            embeds.push(createInfoEmbed({
              int: interaction,
              title: `${user.username} already banned`,
              descr: `${user} has already been banned from this Server.`
            }));
          }
          break;
      }
    } catch (error) {
      console.error('Error running the warn Command:', error);
      embeds.push(createErrorEmbed({
        int: interaction,
        descr: 'There went something wrong while using the Ban Command. \nPlease try again later.'
      }));
    }
  } else {
    const response = await getCommandReply(guild.id, mod.id, user.id, 'ban', banKey, replies);
    embeds.push(createInfoEmbed({
      int: interaction,
      title: response.title, 
      descr: response.description
    }));
  }
  return { title, description, fields, embeds };
}