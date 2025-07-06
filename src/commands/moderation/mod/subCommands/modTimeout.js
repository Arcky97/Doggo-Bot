import { addModerationLogs, getModerationLogs } from "../../../../managers/moderationLogsManager.js";
import { createInfoEmbed, createErrorEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import { createTimeoutAddLogEmbed, createTimeoutRemoveLogEmbed } from "../../../../services/moderationLogService.js";
import { updateUserAttempts } from "../../../../managers/userStatsManager.js";
import { addModerationTask, removeModerationTask } from "../../../../tasks/moderationTasks.js";
import checkLogTypeConfig from "../../../../managers/logging/checkLogTypeConfig.js";
import getUserClass from "../../../../utils/getUserClass.js";
import getCmdReplyKey from "../../../../utils/getCmdReplyKey.js";
import getCommandReply from "../../../../utils/getCommandReply.js";
import createMissingPermissionsEmbed from "../../../../utils/createMissingPermissionsEmbed.js";
import formatTime from "../../../../utils/formatTime.js";
import { findJsonFile } from "../../../../managers/jsonDataManager.js";

const commandReplies = findJsonFile('commandReplies.json', 'data');

export default async (interaction, guild, member, mod, reason, nextId, formatDuration, logChannel, beginTime, endTime, durationMs, timeoutUUID, durationToTomorrow, subCmd) => {
  const embeds = [];
  let title, description, fetchMember;
  let fields = [];

  const permEmbed = await createMissingPermissionsEmbed(interaction, mod, ['ModerateMembers']);
  if (permEmbed) {
    embeds.push(permEmbed);
    return { embeds };
  }

  let [userClass, targetClass] = getUserClass([{ member: mod, perms: ['ModerateMembers'] }, { member: member, perms: ['TimeoutMembers'] }]);
  if (targetClass === userClass && mod.id === member.id) targetClass = 'self';
  let replies = commandReplies['timeout']?.[targetClass]?.[userClass];
  const timeoutKey = getCmdReplyKey(targetClass, mod.id, member?.id);

  if (subCmd === 'add') await updateUserAttempts(guild.id, mod.id, member?.id, 'timeout', timeoutKey, replies?.length > 1);

  if (!replies || subCmd !== 'add') {
    try {
      const timeoutLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'timeouts'});
      switch(subCmd) {
        case 'add':
          if (member) {
            if (!member.communicationDisabledUntilTimestamp) {
              // Add Time out to Member.
              member.timeout(durationMs, reason);
              title = `New Timeout for ${member.user.username}`;
              description = `${member} has been timed out for ${formatDuration !== 'No Duration given' ? `${formatDuration}` : 'an unknown time'}.`;
              fields.push({
                name: `ID: ${nextId}`,
                value:  `**Member:** ${member}\n` +
                        `**Timed out by:** ${mod}\n` +
                        `**Reason:** ${reason}\n` +
                        `**Duration: ** ${formatDuration}`
              });
              if (timeoutLogging.adds) await createTimeoutAddLogEmbed(guild, logChannel, fields);
              await addModerationLogs({ guildId: guild.id, userId: member.id, modId: mod.id, action: 'timeout', reason: reason, status: 'pending', formatDuration: formatDuration, logging: timeoutLogging.adds, logChannel: logChannel?.id, date: beginTime, duration: endTime });
              if (durationMs) {
                if (durationMs < durationToTomorrow) {
                  const guildObj = { id: guild.id, name: guild.name, iconURL: guild.iconURL() };
                  await addModerationTask(nextId, timeoutUUID, guildObj, member, mod.id, durationMs, 'timeout', formatDuration, timeoutLogging.removes, logChannel, beginTime);
                }
              }
            } else {
              // Member already Time out.
              embeds.push(createInfoEmbed({
                int: interaction,
                title: 'Timeout already active.',
                descr: `There's already an active Timeout for ${member.user.username}.`
              }));
            }
          } else {
            // Member not in the Server.
            fetchMember = await client.users.fetch(interaction.options.get('member').value);
            embeds.push(createInfoEmbed({
              int: interaction,
              title: 'Member not in this Server',
              descr: `${fetchMember} is not in this Server so you can't use Timeout on them.`
            }));
          }
          break;
        case 'remove':
          if (member) {
            // Remove Time out from Member.
            if (member.communicationDisabledUntilTimestamp) {
              await addModerationLogs({ guildId: guild.id, userId: member.id, modId: mod.id, action: 'timeout remove', reason: reason, status: 'completed', logging: timeoutLogging.removes, logChannel: logChannel?.id, date: beginTime });
              member.timeout(null, reason);
              const timeoutLog = await getModerationLogs({ guildId: guild.id, userId: member.id, action: 'timeout', last: true });
              const timeoutRemoveLog = await getModerationLogs({ guildId: guild.id, userId: member.id, action: 'timeout remove', last: true });
              let timeTimedOut;
              if (!timeoutLog || (timeoutRemoveLog && timeoutRemoveLog?.date > timeoutLog?.date)) {
                timeTimedOut = 'unknown time';
              } else {
                timeTimedOut = await formatTime(timeoutLog?.date, false) || 'unknown time';
              }
              if (timeoutLog && timeTimedOut !== 'unknown time') await removeModerationTask(timeoutLog.id, guild.id, timeoutLog.timeoutId);
              title = `Timeout Removed for ${member.user.username}`;
              description = `${member} is no longer Timed out.\n Timed out for ${timeTimedOut}.`;
              fields.push({
                name: `ID: ${nextId}`,
                value:  `**Member:** ${member}\n` +
                        `**Timeout Removed by:** <@${mod.id}>\n` +
                        `**Reason:** ${reason}\n` +
                        `**Time Timed out:** ${timeTimedOut}.`
              });
              if (timeoutLogging.removes) await createTimeoutRemoveLogEmbed(guild, logChannel, fields);
            } else {
              // Member is not Timed out.
              embeds.push(createInfoEmbed({
                int: interaction,
                title: 'No Active Timeout',
                descr: `${member} doesn't have an Active Timeout so you can't remove it.`
              }));
            }
          } else {
            // Member not in the Server.
            fetchMember = await client.users.fetch(interaction.options.get('member').value);
            embeds.push(createInfoEmbed({
              int: interaction,
              title: 'Member not in this Server',
              descr: `${fetchMember} is not in this Server so you can't remove a time out from them.`
            }));
          }
          break;
      }
    } catch (error) {
      console.error('Error running the timeout Command:', error);
      embeds.push(createErrorEmbed({
        int: interaction,
        descr: 'There went something wrong while using the Timeout Command. \nPlease try again later.'
      }));
    }
  } else {
    const response = await getCommandReply(guild.id, mod.id, member.id, 'timeout', timeoutKey, replies);
    embeds.push(createInfoEmbed({
      int: interaction,
      title: response.title,
      descr: response.description
    }));
  }
  return { title, description, embeds };
}