const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { addModerationLogs, removeModerationLogs, getModerationLogs, clearModerationLogs, nextModerationLogId, getModerationLogsById, getModerationLogTimeoutId } = require("../../../database/moderationLogs/setModerationLogs");
const { createSuccessEmbed, createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const getOrdinalSuffix = require("../../utils/getOrdinalSuffix");
const pagination = require("../../handlers/pagination");
const convertNumberInTime = require("../../utils/convertNumberInTime");
const calculateEndTime = require('../../utils/calculateEndTime');
const getLogChannel = require("../../utils/logging/getLogChannel");
const checkLogTypeConfig = require("../../utils/logging/checkLogTypeConfig");
const { createWarningAddLogEmbed, createWarningRemoveLogEmbed, createWarningClearLogEmbed, createTimeoutAddLogEmbed, createTimeoutRemoveLogEmbed, createRegularBanLogEmbed, createUnbanLogEmbed, createKickLogEmbed, createMuteLogEmbed, createUnmuteLogEmbed, createSoftBanLogEmbed, createTempBanLogEmbed } = require("../../utils/sendModerationLogEvent");
const formatTime = require("../../utils/formatTime");
const { getMuteRole } = require("../../../database/guildSettings/setGuildSettings");
const { addModerationTask, removeModerationTask, createTimeoutUUID } = require("../../handlers/moderationTasks");
const timeUntilTomorrow = require("../../utils/timeUntilTomorrow");

module.exports = {
  name: 'mod',
  description: 'Various Moderation Commands.',
  deleted: true,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'mute',
      description: 'Mute a member.',
      options: [
        {
          type: ApplicationCommandOptionType.Mentionable,
          name: 'member',
          description: 'The member to mute.',
          required: true 
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'duration',
          description: 'The Duration the member will be muted. (in s, m or h => For ex. 5m = 5 minutes.)'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'reason',
          description: 'The reason for muting the member.'
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'unmute',
      description: 'Unmute a muted member.',
      options: [
        {
          type: ApplicationCommandOptionType.Mentionable,
          name: 'member',
          description: 'The member to unmute.',
          required: true 
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'reason',
          description: 'The reason for unmuting the member.'
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'warn',
      description: 'Warn a member.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'show',
          description: 'Show all warnings or the warning for a specified member.',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to show warnings of.'
            }
          ] 
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'add',
          description: 'Add a new warning for a member',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to warn.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for the warning.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'remove',
          description: 'Remove a warning',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'The ID of the warning to remove.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for removing the warning.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'clear',
          description: 'Remove all warnings for a member',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to remove all warnings.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for clearing all warnings.'
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'timeout',
      description: 'Time out a member.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'add',
          description: 'Add a timeout to a member.',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to timeout.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'duration',
              description: 'The duration of the timeout. (in s, m or h => For ex. 5m = 5 minutes.)',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for adding the timeout.',
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'remove',
          description: 'Remove a timeout from a member.',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to remove the timeout from.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for removing the timeout.'
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'kick',
      description: 'Kick a member from the Server.',
      options: [
        {
          type: ApplicationCommandOptionType.Mentionable,
          name: 'member',
          description: 'The member to kick.',
          required: true 
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'reason',
          description: 'The reason for the kick.'
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'ban',
      description: 'Ban a member from the Server.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'regular',
          description: 'Ban a member for an undefined time.',
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: 'user',
              description: 'The member to ban.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for the ban.'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'time',
              description: 'Delete all message during provided time (max 7 days).'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'soft',
          description: 'Soft ban a member.',
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: 'user',
              description: 'The member to soft ban.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for the soft ban.'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'time',
              description: 'Delete all message during provided time (max 7 days).'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'temp',
          description: 'Temp ban a member',
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: 'user',
              description: 'The member to temp ban.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'duration',
              description: 'The duration the member will be banned.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for the temp ban.'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'time',
              description: 'Delete all messages during provided time (max 7 days).'
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'unban',
      description: 'Unban a banned member from the Server.',
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: 'user',
          description: 'The ID of the member to unban.',
          required: true 
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'reason',
          description: 'The reason for the unban.'
        }
      ]
    }
  ],
  permissionsRequired: [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.MuteMembers
  ],
  botPermissions: [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.MuteMembers
  ],
  callback: async (interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const guildId = interaction.guild.id;
    const mod = interaction.user;
    const modId = interaction.user.id;
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('member');
    let fetchMember;
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided.';
    const time = interaction.options.getString('time')
    const id = interaction.options.getString('id');

    let embed, title, description;
    fields = [];
    const result = calculateEndTime(duration);

    await interaction.deferReply();

    if (!result && duration || result && result.durationMs === 0) {
      embed = createInfoEmbed({
        int: interaction,
        title: `Invalid Duration format`,
        descr: `The duration ${duration} is not a valid duration.`
      });
      return interaction.editReply({embeds: [embed]});
    }

    const logChannel = await getLogChannel(guildId, 'moderation');

    const { beginTime, endTime, durationMs, roundDate } = result || {};

    let formatDuration = roundDate ? convertNumberInTime(durationMs, 'Miliseconds') : await formatTime(endTime, false); 
    if (!formatDuration) formatDuration = 'No Duration given';
    const durationToTomorrow = timeUntilTomorrow();

    const nextId = await nextModerationLogId();
    const timeoutUUID = await createTimeoutUUID(nextId, guildId);

    try {
      switch(subCmdGroup) {
        case 'warn':
          const keys = {guildId: guildId, userId: member?.id, action: 'warn'};
          if (!member) delete keys.userId;
          const warnings = await getModerationLogs(keys);
          const warningLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'warns'});
          switch(subCmd) {
            case 'show':
              const pageSize = 5;
              const embeds = [];
              let pageTracker;
              if (warnings.length > 0) {
                for (var i = 0; i < Math.ceil(warnings.length / pageSize); i++) {
                  pageTracker = warnings.length > pageSize ? `(${1 + (i * pageSize)} - ${Math.min((i + 1) * pageSize, warnings.length)} of ${warnings.length} Warnings)` : '';
                  if (member) {
                    title = `${warnings.length} Warning${warnings.length > 1 ? 's' : ''} for ${member.user.username} ${pageTracker}`
                  } else {
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
                  embed.addFields(fields)
                  embeds.push(embed);
                  fields = [];
                }
                await pagination(interaction, embeds);
                return;              
              } else {
                if (member) {
                  title = `No Warnings for ${member.user.username}`;
                  description = `${member} has no active warnings. Let's hope it stays that way.`;
                } else {
                  title = `No Warnings found`;
                  description = `There are no active warnings in this Server.`
                }
              }
              break;
            case 'add':
              if (member) {
                await addModerationLogs({guildId: guildId, userId: member.id, modId: modId, action: 'warn', reason: reason, logging: warningLogging.adds, logChannel: logChannel?.id });
                title = `New Warning for ${member.user.username}`;
                description = `${member} has been warned for the ${getOrdinalSuffix(warnings.length + 1)} Time!`
                fields.push({
                  name: `ID: ${nextId}`,
                  value:  `**Member:** ${member}\n` +
                          `**Warned by:** <@${modId}>\n` +
                          `**Reason:** ${reason}`
                });
                if (warningLogging.adds) await createWarningAddLogEmbed(guild, logChannel, fields);  
              } else {
                fetchMember = await client.users.fetch(interaction.options.get('member').value);
                embed = createInfoEmbed({
                  int: interaction,
                  title: `Cannot warn ${fetchMember.username}`,
                  descr: `Unable to warn ${fetchMember} as they are not in this Server!`
                });
              }
              break;
            case 'remove':
              const warningById = await getModerationLogsById(guildId, id);
              if (warningById) {
                const user = client.users.cache.get(warningById.userId);
                await removeModerationLogs(guildId, id);
                title = `Warning for ${user.username} removed`;
                description = `The Warning with ID ${id} has been removed.`;
                fields.push({
                  name: `ID: ${id}`,
                  value:  `**Member:** ${user}\n` +
                          `**Removed by:** ${interaction.user}\n` +
                          `**Reason:** ${reason}\n`
                });
              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Warning not found',
                  descr: `No warning with ID ${id} was found for this Server. \nPlease check the ID and try again.`
                });
              }
              if (warningLogging.removes) await createWarningRemoveLogEmbed(guild, logChannel, fields);
              break;
            case 'clear':
              if (!member) fetchMember = await client.users.fetch(interaction.options.get('member').value);
              const memberToClear = member ? member : fetchMember
              const userWarnings = await getModerationLogs({guildId: guildId, userId: memberToClear.id, action: 'warn'});
              if (member || userWarnings) {
                const warningLength = warnings ? warnings.length : userWarnings.length;
                if (warningLength > 0) {
                  await clearModerationLogs(guildId, memberToClear.id, 'warn');
                  title = `Warnings for ${member ? member.user.username : fetchMember.username} Cleared`;
                  description = `All Warnings for ${memberToClear} have been cleared.`;
                  fields.push({
                    name: `Total: ${warningLength}`,
                    value:  `**Member:** ${memberToClear}\n` +
                            `**Cleared by:** ${interaction.user}\n` +
                            `**Reason:** ${reason}\n`
                  });
                } else {
                  embed = createInfoEmbed({
                    int: interaction,
                    title: 'No Warnings found',
                    descr: `${member} doesn't have any Warnings. \nNothing to clear.`
                  });
                }
                if (warningLogging.clears) await createWarningClearLogEmbed(guild, logChannel, fields);
              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Cannot Clear Warnings',
                  descr: `${fetchMember} is not in this server and has no Warnings to clear.`
                });
              }
              break;
          }
          break;
        case 'timeout':
          const timeoutLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'timeouts'});
          switch(subCmd) {
            case 'add':
              if (member) {
                if (!member.communicationDisabledUntilTimestamp) {
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
                  await addModerationLogs({ guildId: guildId, userId: member.id, modId: modId, action: 'timeout', reason: reason, status: 'pending', formatDuration: formatDuration, logging: timeoutLogging.adds, logChannel: logChannel?.id, date: beginTime, duration: endTime });
                  if (durationMs) {
                    if (durationMs < durationToTomorrow) {
                      const guildObj = { id: guild.id, name: guild.name, iconURL: guild.iconURL() };
                      await addModerationTask(nextId, timeoutUUID, guildObj, member, modId, durationMs, 'timeout', formatDuration, timeoutLogging, logChannel, beginTime);
                    }
                  }
                } else {
                  embed = createInfoEmbed({
                    int: interaction,
                    title: 'Timeout already active.',
                    descr: `There's already an active Timeout for ${member.user.username}.`
                  })
                }
              } else {
                fetchMember = await client.users.fetch(member);
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Member not in this Server',
                  descr: `${fetchMember} is not in this Server so you can't use Timeout on them.`
                });
              }
              break;
            case 'remove':
              if (member) {
                const timeoutByUser = await getModerationLogs({ guildId: guildId, userId: member.id, action: 'timeout' });
                if (timeoutByUser.length > 0) {
                  await addModerationLogs({ guildId: guildId, userId: member.id, modId: modId, action: 'timeout remove', reason: reason, status: 'completed', logging: timeoutLogging.removes, logChannel: logChannel?.id, date: beginTime });
                  member.timeout(null, reason);
                  const timeoutLog = await getModerationLogs({ guildId: guildId, userId: member.id, action: 'timeout' });
                  const timeTimedOut = await formatTime(timeoutLog.at(-1)?.date, false) || 'unknown time'; 
                  if (timeoutLog && timeTimedOut !== 'unknown time') await removeModerationTask(timeoutLog.at(-1).id, guildId, timeoutLog.at(-1).timeoutId);
                  title = `Timeout Removed for ${member.user.username}`;
                  description = `${member} is no longer Timed out.\n Timed out for ${timeTimedOut}.`;
                  fields.push({
                    name: `ID: ${timeoutByUser.at(-1).id}`,
                    value:  `**Member:** ${member}\n` +
                            `**Timeout Removed by:** <@${modId}>\n` +
                            `**Reason:** ${reason}\n` +
                            `**Time Timed out:** ${timeTimedOut}.`
                  });
                  if (timeoutLogging.removes) await createTimeoutRemoveLogEmbed(guild, logChannel, fields);
                } else {
                  embed = createInfoEmbed({
                    int: interaction,
                    title: 'No Active Timeout',
                    descr: `${member} doesn't have an Active Timeout so you can't remove it.`
                  });
                }
              } else {
                fetchMember = await client.users.fetch(interaction.options.get('member').value);
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Member not in this Server',
                  descr: `${fetchMember} is not in this Server so you can't remove a time out from them.`
                });
              }
              break;
          }
          break;
        case 'ban':
          if (user.id === '1270100901067100230') {
            createInfoEmbed({
              int: interaction,
              title: 'No, don\'t ban me',
              descr: 'Hey, what did I do wrong to you?'
            });
          }
          const deleteMessagesMs = calculateEndTime(time, true) || 0;
          const deleteMessages = Math.round(deleteMessagesMs / 1000);
          const deleteMessagesFor = deleteMessages !== 0 ? convertNumberInTime(deleteMessages, 'Seconds') : 'Didn\'t delete any';
          const banLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'bans' });
          switch (subCmd) {
            case 'regular':
              const banInfo = await guild.bans.fetch(user.id).catch(() => null);
              if (!banInfo) {
                await addModerationLogs({guildId: guildId, userId: user.id, modId: modId, action: 'ban', reason: reason, date: beginTime});
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
                embed = createInfoEmbed({
                  int: interaction,
                  title: `${user.username} already banned`,
                  descr: `${user} has already been banned from this Server.`
                });
              }
              break;
            case 'soft':
              const softBanInfo = await guild.members.fetch(user.id).catch(() => null);
              console.log(softBanInfo);
              if (softBanInfo) {
                await addModerationLogs({ guildId: guildId, userId: user.id, modId: modId, action: 'ban', reason: reason, date: beginTime});
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
                embed = createInfoEmbed({
                  int: interaction,
                  title: `Member not in this Server`,
                  descr: `${user} is not in this Server so soft banning won't have any effect. \nUse \`mod ban regular\` or \`mod ban temp\` instead.`
                })
              }
              break;
            case 'temp':
              const tempBanInfo = await guild.bans.fetch(user.id).catch(() => null);
              if (!tempBanInfo) {
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
                await addModerationLogs({ guildId: guildId, userId: user.id, modId: modId, action: 'ban', reason: reason, status: 'pending', formatDuration: formatDuration, logging: banLogging.temps, logChannel: logChannel?.id, date: beginTime, duration: endTime });
                if (durationMs) {
                  if (durationMs < durationToTomorrow) {
                    const guildObj = { id: guild.id, name: guild.name, iconURL: guild.iconURL() };
                    await addModerationTask(nextId, timeoutUUID, guildObj, user, modId, durationMs, 'ban', formatDuration, unmuteLogging, logChannel, beginTime);
                  }
                }
              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: `${user.username} already banned`,
                  descr: `${user} has already been banned from this Server.`
                });
              }
              break;
          }
          break;
        default: 
          const muteRole = await getMuteRole(guildId);
          if (subCmd === 'mute' || subCmd === 'unmute') {
            const role = guild.roles.cache.find(r => r.id === muteRole);
            if (!role) {
              embed = createInfoEmbed({
                int: interaction,
                title: 'No Mute Role',
                descr: 'You haven\'t setup a Mute Role for this Server yet. \nUse `setup mute-role` to set one up.'
              });
              break;
            }
          }
          const muteLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'mutes' });
          const unmuteLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'unmutes' });
          switch(subCmd) {
            case 'mute':
              if (member) {
                if (!member.roles.cache.has(muteRole)) {
                  await member.roles.add(muteRole);
                  title = `Muted ${member.user.username}`;
                  description = `${member} has been given the <@&${muteRole}> Role and is now muted for ${formatDuration !== 'No Duration given' ? `${formatDuration}` : 'an unknown time'}.`;
                  fields.push({
                    name: `ID: ${nextId}`,
                    value:  `**Member:** ${member}\n` +
                            `**Muted by:** <@${modId}>\n` +
                            `**Reason:** ${reason}\n` +
                            `**Duration:** ${formatDuration}`
                  });
                  if (muteLogging) await createMuteLogEmbed(guild, logChannel, fields);
                  await addModerationLogs({ guildId: guildId, userId: member.id, modId: modId, action: 'mute', reason: reason, status: 'pending', formatDuration: formatDuration, logging: muteLogging, logChannel: logChannel?.id, date: beginTime, duration: endTime });
                  if (durationMs) {
                    if (durationMs < durationToTomorrow) {
                      const guildObj = { id: guild.id, name: guild.name, iconURL: guild.iconURL() };
                      await addModerationTask(nextId, timeoutUUID, guildObj, member, modId, durationMs, 'mute', formatDuration, unmuteLogging, logChannel, beginTime);
                    }
                  } 
                } else {
                  embed = createInfoEmbed({
                    int: interaction,
                    title: 'Already Muted',
                    descr: `${member} is already muted.`
                  });
                }
              } else {
                fetchMember = await client.users.fetch(interaction.options.get('member').value);
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Cannot Mute Member',
                  descr: `${fetchMember} cannot be Muted as they are not in this Server.`
                });
              }
              break;
            case 'unmute':
              if (member) {
                if (member.roles.cache.has(muteRole)) {
                  await addModerationLogs({ guildId: guildId, userId: member.id, modId, modId, action: 'unmute', reason: reason, status: 'completed', logging: unmuteLogging, logChannel: logChannel?.id, date: beginTime });
                  await member.roles.remove(muteRole);
                  const muteLog = await getModerationLogs({ guildId: guildId, userId: member.id, action: 'mute'});
                  const timeMuted = await formatTime(muteLog.at(-1)?.date, false) || 'unknown time';
                  if (muteLog && timeMuted !== 'unknown time') await removeModerationTask(muteLog.at(-1).id, guildId, muteLog.at(-1).timeoutId);
                  title = `Unmuted ${member.user.username}`;
                  description = `${member} has been taken away the <@&${muteRole}> Role and is no longer Muted.\n Muted for ${timeMuted}.`;
                  fields.push({
                    name: `ID: ${nextId}`,
                    value:  `**Member:** ${member}\n` +
                            `**Unmuted by:** <@${modId}>\n` +
                            `**Reason:** ${reason}\n` +
                            `**Time Muted:** ${timeMuted}.`
                  });
                  if (unmuteLogging) await createUnmuteLogEmbed(guild, logChannel, fields);
                } else {
                  embed = createInfoEmbed({
                    int: interaction,
                    title: 'Cannot Unmute Member',
                    descr: `${member} cannot be Unmuted as they were not muted.`
                  });
                }
              } else {
                fetchMember = await client.users.fetch(interaction.options.get('member').value);
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Cannot Unmute Member',
                  descr: `${fetchMember} cannot be Unmuted as they are not in this Server.`                
                });
              }
              break; 
            case 'kick':
              const kickLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'kicks'});
              if (member) {
                await addModerationLogs({ guildId: guildId, userId: member.id, modId: modId, action: 'kick', reason: reason });
                await member.kick({ reason: reason });
                title = `Kicked ${member.user.username}`;
                description = `${member} has been kicked from the Server.`;
                fields.push({
                  name: `ID: ${nextId}`,
                  value:  `**Member:** ${member}\n` +
                          `**Kicked by:** <@${modId}>\n` +
                          `**Reason:** ${reason}`
                });
                if (kickLogging) await createKickLogEmbed(guild, logChannel, fields);
              } else {
                fetchMember = await client.users.fetch(interaction.options.get('member').value);
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Cannot kick member',
                  descr: `${fetchMember} cannot be kicked from the Server as they are not in the Server (anymore).`
                });
              }
              break;
            case 'unban':
              const banLog = await getModerationLogs({ guildId: guildId, userId: user.id, action: 'ban' });
              const unbanLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'unbans'});
              const unbanInfo = await interaction.guild.bans.fetch(user.id).catch(() => null);
              if (unbanInfo) {
                await addModerationLogs({ guildId: guildId, userId: user.id, modId: modId, action: 'unban', reason: reason, status: 'completed', logging: unbanLogging, logChannel: logChannel?.id, date: beginTime });
                await interaction.guild.members.unban(user.id, reason);
                const timeBanned = await formatTime(banLog.at(-1)?.date, false) || 'unknown time';
                if (banLog && timeBanned !== 'unknown time') await removeModerationTask(banLog.at(-1).id, guildId, banLog.at(-1).timeoutId);
                title = `Unbanned ${user.username}`;
                description = `${user} has been unbanned!\n Banned for ${timeBanned}`;
                fields.push({
                  name: `ID: ${nextId}`,
                  value:  `**User:** ${user}\n` +
                          `**Unbanned by:** <@${modId}>\n` +
                          `**Reason:** ${reason}\n` +
                          `**Time Banned:** ${timeBanned}.`
                });
                if (unbanLogging) await createUnbanLogEmbed(guild, logChannel, fields);
              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: `${user.username} not banned`,
                  descr: `${user} wasn't banned so they cannot be unbanned from this Server.`
                });
              }
              break;
          }
          break;
      }
    } catch (error) {
      console.error('Error executing moderation command:', error);
    }
    if (!embed) {
      embed = createSuccessEmbed({
        int: interaction,
        title: title,
        descr: description ? description : null,
      });
    }
    interaction.editReply({embeds: [embed]});
  }
};