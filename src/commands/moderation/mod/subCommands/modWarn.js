import { addModerationLogs, removeModerationLogs, getModerationLogs, clearModerationLogs, getModerationLogsById } from "../../../../managers/moderationLogsManager.js";
import { createSuccessEmbed, createInfoEmbed, createErrorEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import { createWarningAddLogEmbed, createWarningRemoveLogEmbed, createWarningClearLogEmbed } from "../../../../services/moderationLogService.js";
import { updateUserAttempts } from "../../../../managers/userStatsManager.js";
import checkLogTypeConfig from "../../../../managers/logging/checkLogTypeConfig.js";
import getUserClass from "../../../../utils/getUserClass.js";
import getCmdReplyKey from "../../../../utils/getCmdReplyKey.js";
import getCommandReply from "../../../../utils/getCommandReply.js";
import createMissingPermissionsEmbed from "../../../../utils/createMissingPermissionsEmbed.js";
import getOrdinalSuffix from "../../../../utils/getOrdinalSuffix.js";
import { findJsonFile } from "../../../../managers/jsonDataManager.js";

const commandReplies = findJsonFile('commandReplies.json', 'data');

export default async (interaction, guild, member, mod, reason, nextId, logChannel, subCmd) => {
  const embeds = [];
  let title, description, fetchMember;
  let fields = [];
  let usePagination = false;

  const permEmbed = await createMissingPermissionsEmbed(interaction, mod, ['ManageRoles']);
  if (permEmbed) {
    embeds.push(permEmbed);
    return { embeds, usePagination };
  }

  const [userClass, targetClass] = getUserClass([{ member: mod, perms: ['ManageRoles'] }, { member: member, perms: ["ManageRoles"] }]);
  let replies = commandReplies['warn']?.[targetClass]?.[userClass];
  const warnKey = getCmdReplyKey(targetClass, mod.id, member?.id);

  if (subCmd === 'add') await updateUserAttempts(guild.id, mod.id, member?.id, 'warn', warnKey, replies?.length > 1);

  if (!replies || subCmd !== 'add') {
    try {
      const keys = {guildId: guild.id, userId: member?.id, action: 'warn'};
      if (!member) delete keys.userId;
      const warnings = await getModerationLogs(keys);
      const warningLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'warns'});
      switch(subCmd) {
        case 'show':
          const pageSize = 5;
          let pageTracker;
          let embed;
          if (warnings.length > 0) {
            for (var i = 0; i < Math.ceil(warnings.length / pageSize); i++) {
              pageTracker = warnings.length > pageSize ? `(${1 + (i * pageSize)} - ${Math.min((i + 1) * pageSize, warnings.length)} of ${warnings.length} Warnings)` : '';
              if (member) {
                // Show Warnings for Member
                title = `${warnings.length} Warning${warnings.length > 1 ? 's' : ''} for ${member.user.username} ${pageTracker}`
              } else {
                // Show all Warnings in the Server.
                title = `All Warnings ${pageTracker}`;
              }
              for (let j = i * pageSize; j < (i * pageSize) + pageSize && j < warnings.length; j++) {
                let log = warnings[j];
                fields.push({
                  name: `ID: ${log.id}`,
                  value:  `${!member ? `**Member:** <@${log.userId}>\n` : ''}` +
                          `**Warned by:** <@${log.modId}>\n` + 
                          `**Reason:** ${log.reason}\n` +
                          `**Date:** ${(log.date)}`
                });
              }
              embed = createSuccessEmbed({
                int: interaction,
                title: title,
                descr: null 
              });
              embed.addFields(fields);
              embeds.push(embed);
              fields = [];
            }
            usePagination = true;        
          } else {
            if (member) {
              // Member has no Warnings.
              title = `No Warnings for ${member.user.username}`;
              description = `${member} has no active warnings. Let's hope it stays that way.`;
            } else {
              // Server has no Warnings.
              title = `No Warnings found`;
              description = `There are no active warnings in this Server.`
            }
          }
          break;
        case 'add':
          if (member) {
            // Member found and add the warning.
            await addModerationLogs({guildId: guild.id, userId: member.id, modId: mod.id, action: 'warn', reason: reason, logging: warningLogging.adds, logChannel: logChannel?.id });
            title = `New Warning for ${member.user.username}`;
            description = `${member} has been warned for the ${getOrdinalSuffix(warnings.length + 1)} Time!`
            fields.push({
              name: `ID: ${nextId}`,
              value:  `**Member:** ${member}\n` +
                      `**Warned by:** <@${mod.id}>\n` +
                      `**Reason:** ${reason}`
            });
            if (warningLogging.adds) await createWarningAddLogEmbed(guild, logChannel, fields);  
          } else {
            // Member not in the Server.
            fetchMember = await client.users.fetch(interaction.options.get('member').value);
            embeds.push(createInfoEmbed({
              int: interaction,
              title: `Cannot warn ${fetchMember.username}`,
              descr: `Unable to warn ${fetchMember} as they are not in this Server!`
            }));
          }
          break;
        case 'remove':
          const id = interaction.options.getString('id');
          const warningById = await getModerationLogsById(guild.id, id);
          if (warningById) {
            // Remove Warning with given ID.
            const user = client.users.cache.get(warningById.userId);
            await removeModerationLogs(guild.id, id);
            title = `Warning for ${user.username} removed`;
            description = `The Warning with ID ${id} has been removed.`;
            fields.push({
              name: `ID: ${id}`,
              value:  `**Member:** ${user}\n` +
                      `**Removed by:** ${interaction.user}\n` +
                      `**Reason:** ${reason}\n`
            });
          } else {
            // No Warning found for given ID.
            embeds.push(createInfoEmbed({
              int: interaction,
              title: 'Warning not found',
              descr: `No warning with ID ${id} was found for this Server. \nPlease check the ID and try again.`
            }));
          }
          if (warningLogging.removes) await createWarningRemoveLogEmbed(guild, logChannel, fields);
          break;
        case 'clear':
          if (!member) fetchMember = await client.users.fetch(interaction.options.get('member').value);
          const memberToClear = member ? member : fetchMember
          const userWarnings = await getModerationLogs({guildId: guild.id, userId: memberToClear.id, action: 'warn'});
          if (member && userWarnings) {
            // Member in the Server.
            const warningLength = warnings ? warnings.length : userWarnings.length;
            if (warningLength > 0) {
              // Clear all Warnings for Member.
              await clearModerationLogs(guild.id, memberToClear.id, 'warn');
              title = `Warnings for ${member ? member.user.username : fetchMember.username} Cleared`;
              description = `All Warnings for ${memberToClear} have been cleared.`;
              fields.push({
                name: `Total: ${warningLength}`,
                value:  `**Member:** ${memberToClear}\n` +
                        `**Cleared by:** ${interaction.user}\n` +
                        `**Reason:** ${reason}\n`
              });
            } else {
              // No Warnings found for Member.
              embeds.push(createInfoEmbed({
                int: interaction,
                title: 'No Warnings found',
                descr: `${member} doesn't have any Warnings. \nNothing to clear.`
              }));
            }
            if (warningLogging.clears) await createWarningClearLogEmbed(guild, logChannel, fields);
          } else {
            // Member not in the Server.
            embeds.push(createInfoEmbed({
              int: interaction,
              title: 'Cannot Clear Warnings',
              descr: `${fetchMember} is not in this server and has no Warnings to clear.`
            }));
          }
          break;
      }
    } catch (error) {
      console.error('Error running the warn Command:', error);
      embeds.push(createErrorEmbed({
        int: interaction,
        descr: 'There went something wrong while using the Warn Command. \nPlease try again later.' 
      }));
    }
  } else {
    const response = await getCommandReply(guild.id, mod.id, member.id, 'warn', warnKey, replies);
    embeds.push(createInfoEmbed({
        int: interaction,
        title: response.title,
        descr: response.description
    }));
  }
  return { title, description, embeds, usePagination }
}