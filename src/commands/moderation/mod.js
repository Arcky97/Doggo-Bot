const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { addModerationLogs, removeModerationLogs, getModerationLogs, clearModerationLogs, nextModerationLogId, getModerationLogsById } = require("../../../database/moderationLogs/setModerationLogs");
const { createSuccessEmbed, createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const getOrdinalSuffix = require("../../utils/getOrdinalSuffix");
const pagination = require("../../handlers/pagination");
const convertNumberInTime = require("../../utils/convertNumberInTime");
const calculateEndTime = require('../../utils/calculateEndTime');
const getLogChannel = require("../../utils/logging/getLogChannel");
const checkLogTypeConfig = require("../../utils/logging/checkLogTypeConfig");
const { createWarningAddLogEmbed } = require("../../utils/sendModerationLogEvent");

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
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to ban.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for the ban.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'soft',
          description: 'Soft ban a member.',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to soft ban.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for the soft ban.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'temp',
          description: 'Temp ban a member',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'member',
              description: 'The member to temp ban.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'duration',
              description: 'The duration the member will be banned. (s, m or h => For ex. 5m = 5 minutes.)',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'reason',
              description: 'The reason for the temp ban.'
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
          type: ApplicationCommandOptionType.Mentionable,
          name: 'member',
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
    const member = interaction.options.getMember('member');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided.';
    const id = interaction.options.getString('id');

    let embed, title, description;
    let fields = [];
    const result = calculateEndTime(duration);

    await interaction.deferReply();

    if (!result && duration) {
      embed = createInfoEmbed({
        int: interaction,
        title: `Invalid Duration format`,
        descr: `The duration ${duration} is not a valid duration.`
      });
      return interaction.editReply({embeds: [embed]});
    }

    const logChannel = await getLogChannel(client, guildId, 'moderation');

    const { endTime, durationMs } = result || {};
    try {
      switch(subCmdGroup) {
        case 'warn':
          const keys = {guildId: guildId, userId: member?.id, action: 'warn'};
          if (!member) delete keys.userId;
          const warnings = await getModerationLogs(keys);
          const warningLogging = await checkLogTypeConfig({ guildId: guildId, type: 'moderation', option: 'warns'})
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
                      value:  `${!member ? `**User:** <@${log.userId}>\n` : ''}` +
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
                title = `No Warnings for ${member.user.username}`;
                description = `${member} has no active warnings. Let's hope it stays that way.`;
              }
              break;
            case 'add':
              const nextWarningId = await nextModerationLogId();
              await addModerationLogs({guildId: guildId, userId: member.id, modId: modId, action: subCmdGroup, reason: reason});
              title = `New Warning for ${member.user.username}`;
              description = `${member} has been warned for the ${getOrdinalSuffix(warnings.length + 1)} Time!`
              fields.push({
                name: `ID: ${nextWarningId}`,
                value:  `**Warned by:** <@${modId}>\n` +
                        `**Reason:** ${reason}\n`
              });
              await createWarningAddLogEmbed(guild, logChannel, title, fields)
              break;
            case 'remove':
              const warningById = await getModerationLogsById(guildId, id);
              if (warningById) {
                const user = client.users.cache.get(warningById.userId);
                await removeModerationLogs(id);
                title = `Warning for ${user.username} removed`;
                description = `The Warning with ID ${id} has been removed.`;
                fields.push({
                  name: `ID: ${id}`,
                  value:  `**Removed by:** ${interaction.user}\n` +
                          `**Reason:** ${reason}\n`
                });
              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'Warning not found',
                  descr: `No warning with ID ${id} was found for this Server. \nPlease check the ID and try again.`
                });
              }
              break;
            case 'clear':
              const warningsByUser = await getModerationLogs({guildId: guildId, userId: member.id, action: 'warn'});
              if (warningsByUser.length > 0) {
                await clearModerationLogs(guildId, member.id, 'warn');
                title = `Warnings for ${member.user.username} Cleared`;
                description = `All Warnings for ${member} have been cleared.`;
                fields.push({
                  name: `Total: ${warningsByUser.length}`,
                  value:  `**Cleared by:** ${interaction.user}\n` +
                          `**Reason:** ${reason}\n`
                });
              } else {
                embed = createInfoEmbed({
                  int: interaction,
                  title: 'No Warnings found',
                  descr: `${member} doesn't have any Warnings. \nNothing to clear.`
                });
              }
              break;
          }
          break;
        case 'timeout':
          switch(subCmd) {
            case 'add':
              const nextTimeoutId = await nextModerationLogId();
              await addModerationLogs({guildId: guildId, userId: member.id, modId: modId, action: subCmdGroup, reason: reason, duration: endTime});
              member.timeout(durationMs, reason);
              title = `New Timeout for ${member.user.username}`;
              description = `${member} has been timed out for ${convertNumberInTime(durationMs, 'Miliseconds')}!`;
              fields.push({
                name: `ID: ${nextTimeoutId}`,
                value:  `**Timed out by: ** <@${modId}>\n` +
                        `**Reason:** ${reason}\n` +
                        `**Duration: ** ${convertNumberInTime(durationMs, 'Miliseconds')}`
              })
              break;
            case 'remove':
              break;
          }
          break;
        case 'ban':
          await interaction.editReply('You chose the ban command.');
          break;
        default: 
          switch(subCmd) {
            case 'mute':
              await interaction.editReply('You chose the mute command.');
              break;
            case 'unmute':
              await interaction.editReply('You chose the unmute command.');
              break; 
            case 'kick':
              await interaction.editReply('You chose the kick command.');
              break;
            case 'unban':
              await interaction.editReply('You chose the unban command.');
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
      //if (fields.length >= 1) embed.addFields(fields);
    }
    interaction.editReply({embeds: [embed]});
  }
};