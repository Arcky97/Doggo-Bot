import { addModerationLogs } from "../../../../managers/moderationLogsManager.js";
import { createInfoEmbed, createErrorEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import { createMuteLogEmbed } from "../../../../services/moderationLogService.js";
import { updateUserAttempts } from "../../../../managers/userStatsManager.js";
import { addModerationTask } from "../../../../tasks/moderationTasks.js";
import checkLogTypeConfig from "../../../../managers/logging/checkLogTypeConfig.js";
import getUserClass from "../../../../utils/getUserClass.js";
import getCmdReplyKey from "../../../../utils/getCmdReplyKey.js";
import getCommandReply from "../../../../utils/getCommandReply.js";
import createMissingPermissionsEmbed from "../../../../utils/createMissingPermissionsEmbed.js";
import { findJsonFile } from "../../../../managers/jsonDataManager.js";

const commandReplies = findJsonFile('commandReplies.json', 'data');

export default async (interaction, guild, member, mod, reason, nextId, formatDuration, logChannel, beginTime, endTime, durationMs, muteRole, timeoutUUID, durationToTomorrow) => {
  const embeds = [];
  let title, description, fetchMember;
  let fields = [];

  const permEmbed = await createMissingPermissionsEmbed(interaction, mod, ['ManageRoles']);
  if (permEmbed) {
    embeds.push(permEmbed);
    return { embeds };
  }

  let [userClass, targetClass] = getUserClass([{ member: mod, perms: ['ManageRoles'] }, { member: member, perms: ['ManageRoles'] }]);
  if (targetClass === userClass && mod.id === member.id) targetClass = 'self';
  let replies = commandReplies['mute']?.[targetClass]?.[userClass];
  const muteKey = getCmdReplyKey(targetClass, mod.id, member?.id);

  await updateUserAttempts(guild.id, mod.id, member?.id, 'mute', muteKey, replies?.length > 1);

  if (!replies) {
    try {
      const muteLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'mutes' });
      const unmuteLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'unmutes' });
      if (member) {
        if (!member.roles.cache.has(muteRole)) {
          // Mute Member.
          await member.roles.add(muteRole);
          title = `Muted ${member.user.username}`;
          description = `${member} has been given the <@&${muteRole}> Role and is now muted for ${formatDuration !== 'No Duration given' ? `${formatDuration}` : 'an unknown time'}.`;
          fields.push({
            name: `ID: ${nextId}`,
            value:  `**Member:** ${member}\n` +
                    `**Muted by:** ${mod}\n` +
                    `**Reason:** ${reason}\n` +
                    `**Duration:** ${formatDuration}`
          });
          if (muteLogging) await createMuteLogEmbed(guild, logChannel, fields);
          await addModerationLogs({ guildId: guild.id, userId: member.id, modId: mod.id, action: 'mute', reason: reason, status: 'pending', formatDuration: formatDuration, logging: muteLogging, logChannel: logChannel?.id, date: beginTime, duration: endTime });
          if (durationMs) {
            if (durationMs < 60000) {
              await addModerationTask(nextId, timeoutUUID, guild, member, mod.id, durationMs, 'mute', formatDuration, unmuteLogging, logChannel, beginTime);
            }
          } 
        } else {
          // Member already muted.
          embeds.push(createInfoEmbed({
            int: interaction,
            title: 'Already Muted',
            descr: `${member} is already muted.`
          }));
        }
      } else {
        // Member not in the Server.
        fetchMember = await client.users.fetch(interaction.options.get('member').value);
        embeds.push(createInfoEmbed({
          int: interaction,
          title: 'Cannot Mute Member',
          descr: `${fetchMember} cannot be Muted as they are not in this Server.`
        }));
      }
    } catch (error) {
      console.error('Error running the mute Command:', error);
      embeds.push(createErrorEmbed({
        int: interaction,
        descr: 'There went something wrong while using the Mute Command. \nPlease try again later.'
      }));
    }
  } else {
    const response = await getCommandReply(guild.id, mod.id, member.id, 'mute', muteKey, replies);
    embeds.push(createInfoEmbed({
      int: interaction,
      title: response.title,
      descr: response.description
    }));
  }
  return { title, description, embeds };
}