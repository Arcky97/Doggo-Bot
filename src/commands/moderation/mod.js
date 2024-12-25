const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { addModerationLogs, removeModerationLogs, getModerationLogs, clearModerationLogs, nextModerationLogId, getModerationLogsById } = require("../../../database/moderationLogs/setModerationLogs");
const { createSuccessEmbed, createInfoEmbed, createUnfinishedEmbed } = require("../../utils/embeds/createReplyEmbed");
const getOrdinalSuffix = require("../../utils/getOrdinalSuffix");
const pagination = require("../../handlers/pagination");
const convertNumberInTime = require("../../utils/convertNumberInTime");
const calculateEndTime = require('../../utils/calculateEndTime');
const getLogChannel = require("../../utils/logging/getLogChannel");
const checkLogTypeConfig = require("../../utils/logging/checkLogTypeConfig");
const { createWarningAddLogEmbed, createWarningRemoveLogEmbed, createWarningClearLogEmbed, createTimeoutAddLogEmbed, createTimeoutRemoveLogEmbed, createRegularBanLogEmbed, createUnbanLogEmbed } = require("../../utils/sendModerationLogEvent");
const formatTime = require("../../utils/formatTime");
const activeTimeouts = new Map();

module.exports = {
  name: 'mod',
  description: 'Various Moderation Commands.',
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
  callback: async (client, interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const guildId = interaction.guild.id;
    const modId = interaction.user.id;
    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('member');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided.';
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

    const logChannel = await getLogChannel(client, guildId, 'moderation');

    const { beginTime, endTime, durationMs } = result || {};

    const nextId = await nextModerationLogId();
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
                await addModerationLogs({guildId: guildId, userId: member.id, modId: modId, action: subCmdGroup, reason: reason});
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
                const fetchUser = await client.users.fetch(interaction.options.get('member').value);
                embed = createInfoEmbed({
                  int: interaction,
                  title: `Cannot warn ${fetchUser.username}`,
                  descr: `Unable to warn ${fetchUser} as they are not in this Server!`
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
              if (warnings.length > 0) {
                await clearModerationLogs(guildId, member.id, 'warn');
                title = `Warnings for ${member.user.username} Cleared`;
                description = `All Warnings for ${member} have been cleared.`;
                fields.push({
                  name: `Total: ${warnings.length}`,
                  value:  `**Member:** ${member}\n` +
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
              break;
          }
          break;
        case 'timeout':
          const timeoutLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'timeouts'});
          const user = interaction.options.getMember('member');
          switch(subCmd) {
            case 'add':
              if (!member.communicationDisabledUntilTimestamp) {
                // Store timeout in the Map with guildId
                activeTimeouts.set(nextId, guildId);
                await addModerationLogs({guildId: guildId, userId: member.id, modId: modId, action: subCmdGroup, reason: reason, date: beginTime, duration: endTime});
                user.timeout(durationMs, reason);
                title = `New Timeout for ${member.user.username}`;
                description = `${member} has been timed out for ${convertNumberInTime(durationMs, 'Miliseconds')}!`;
                fields.push({
                  name: `ID: ${nextId}`,
                  value:  `**Member:** ${member}\n` +
                          `**Timed out by:** <@${modId}>\n` +
                          `**Reason:** ${reason}\n` +
                          `**Duration: ** ${convertNumberInTime(durationMs, 'Miliseconds')}`
                });
                if (timeoutLogging.adds) await createTimeoutAddLogEmbed(guild, logChannel, fields);
                
                setTimeout(async () => {
                  const guildId = activeTimeouts.get(nextId);
                  if (guildId) {
                    await removeModerationLogs(guildId, nextId);
                    activeTimeouts.delete(nextId);
  
                    fields = [{
                      name: `ID: ${nextId}`,
                      value:  `**Member:** ${member}\n` +
                              `**Timed out by:** <@${modId}>\n` +
                              `**Reason:** Automatic Removal`
                    }];
                    if (timeoutLogging.removes) await createTimeoutRemoveLogEmbed(guild, logChannel, fields);
                  }
                }, durationMs)
              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Timeout already active.',
                  descr: `There's already an active Timeout for ${member.user.username}.`
                })
              }
              break;
            case 'remove':
              const timeoutByUser = await getModerationLogs({ guildId: guildId, userId: member.id, action: 'timeout' });
              const guildIdToRemove = activeTimeouts.get(timeoutByUser.at(-1).id);
              const timeoutDuration = timeoutByUser.at(-1).endTime - timeoutByUser.at(-1).date;
              if (timeoutDuration >= 86400) {
                console.log('The timeout lasts more than 1 day...'); 
              } else {
                console.log('The timeout lasts less than 1 day...');
              }
              if (guildIdToRemove) {
                await removeModerationLogs(guildIdToRemove, id); 
                activeTimeouts.delete(id);
              }
              
              user.timeout(null, reason);

              title = `Timeout Removed for ${member.user.username}`;
              description = `${member} is no longer Timed out.`;
              fields.push({
                name: `ID: ${timeoutByUser.at(-1).id}`,
                value:  `**Member:** ${member}\n` +
                        `**Removed by:** <@${modId}>\n` +
                        `**Reason:** ${reason}\n`
              });
              if (timeoutLogging.removes) await createTimeoutRemoveLogEmbed(guild, logChannel, fields);
              break;
          }
          break;
        case 'ban':
          if (member.id === '1270100901067100230') {
            createInfoEmbed({
              int: interaction,
              title: 'No, don\'t ban me',
              descr: 'Hey, what did I do wrong to you?'
            });
          }
          const banLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'bans' });
          switch (subCmd) {
            case 'regular':
              const banInfo = await interaction.guild.bans.fetch(member.id).catch(() => null);
              if (!banInfo) {
                await addModerationLogs({guildId: guildId, userId: member.id, modId: modId, action: 'ban', reason: reason, date: beginTime})
                title = `Banned ${user.username}`;
                description = `${user} has been banned!`;
                fields.push({
                  name: `ID: ${nextId}`,
                  value:  `**User:** ${user}\n` +
                          `**Banned by:** <@${modId}>\n` +
                          `**Reason:** ${reason}`
                })
                await interaction.guild.members.ban(member.id, { reason: reason });
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
              const softBanInfo = client.users.cache.find(member => member.id === user.id);
              if (softBanInfo) {

              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: `Member not in this Server`,
                  descr: `${user} is not in this Server so soft banning won't have any effect. \nUse \`mod ban regular\` or \`mod ban temp\` instead.`
                })
              }
              embed = createUnfinishedEmbed(interaction);
              break;
            case 'temp':
              embed = createUnfinishedEmbed(interaction);
              break;
          }
          break;
        default: 
          switch(subCmd) {
            case 'mute':
              embed = createUnfinishedEmbed(interaction);
              break;
            case 'unmute':
              embed = createUnfinishedEmbed(interaction);
              break; 
            case 'kick':
              embed = createUnfinishedEmbed(interaction);
              break;
            case 'unban':
              const banLog = await getModerationLogs({ guildId: guildId, userId: member.id, action: 'ban'});
              const unbanLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'unbans'});
              const unbanInfo = await interaction.guild.bans.fetch(member.id).catch(() => null);
              if (unbanInfo) {
                await addModerationLogs({ guildId: guildId, userId: member.id, modId: modId, action: 'unban', reason: reason});
                title = `Unbanned ${user.username}`;
                description = `${user} has been unbanned!`;
                fields.push({
                  name: `ID: ${nextId}`,
                  value:  `**User:** ${user}\n` +
                          `**Unbanned by:** <@${modId}>\n` +
                          `**Reason:** ${reason}\n` +
                          `**Time Banned:** ${await formatTime(banLog.at(-1).date, false)}`
                });
                await interaction.guild.members.unban(member.id, reason);
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