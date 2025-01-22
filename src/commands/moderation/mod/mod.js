const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { nextModerationLogId } = require("../../../../database/moderationLogs/setModerationLogs");
const { createSuccessEmbed, createInfoEmbed } = require("../../../utils/embeds/createReplyEmbed");
const convertNumberInTime = require("../../../utils/convertNumberInTime");
const calculateEndTime = require('../../../utils/calculateEndTime');
const getLogChannel = require("../../../utils/logging/getLogChannel");
const formatTime = require("../../../utils/formatTime");
const { getMuteRole } = require("../../../../database/guildSettings/setGuildSettings");
const { createTimeoutUUID } = require("../../../handlers/moderationTasks");
const timeUntilTomorrow = require("../../../utils/timeUntilTomorrow");
const getUserClass = require("../../../utils/getUserClass");
const modKick = require("./subCommands/modKick");
const modUnban = require("./subCommands/modUnban");
const modMute = require("./subCommands/modMute");
const ModUnmute = require("./subCommands/ModUnmute");
const modWarn = require("./subCommands/modWarn");
const modTimeout = require("./subCommands/modTimeout");
const modBan = require("./subCommands/modBan");
const pagination = require("../../../handlers/pagination");

module.exports = {
  name: 'mod',
  description: 'Various Moderation Commands.',
  //deleted: true,
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
  callback: async (interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();

    const guild = interaction.guild;
    const mod = interaction.member;

    const user = interaction.options.getUser('user');
    const member = interaction.options.getMember('member');

    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    await interaction.deferReply();

    let embed, modAction;

    const result = calculateEndTime(duration);
    if (!result && duration || result && result.durationMs === 0) {
      embed = createInfoEmbed({
        int: interaction,
        title: `Invalid Duration format`,
        descr: `The duration ${duration} is not a valid duration.`
      });
      return interaction.editReply({embeds: [embed]});
    }

    const logChannel = await getLogChannel(guild.id, 'moderation', true);
    if (logChannel?.array?.length > 0) {
      embed = createInfoEmbed({
        int: interaction,
        title: 'Missing Channel Permissions',
        descr: `<#${logChannel.id}>, used for **Moderation Logging**, is missing following permissions: \n- ${logChannel.array.join('\n- ')}\n`
      });
      return interaction.editReply( {embeds: [embed] });
    }

    const { beginTime, endTime, durationMs, roundDate } = result || {};
    
    let formatDuration = roundDate ? convertNumberInTime(durationMs, 'Miliseconds') : await formatTime(endTime, false); 
    if (!formatDuration) formatDuration = 'No Duration given';

    const durationToTomorrow = timeUntilTomorrow();
    const nextId = await nextModerationLogId();
    const timeoutUUID = await createTimeoutUUID(nextId, guild.id);

    try {
      switch(subCmdGroup) {
        // Manage Warnings of Members in the Server.
        case 'warn':
          modAction = await modWarn(
            interaction, guild, member, mod, reason, nextId, logChannel, subCmd
          );
          break;
          // Manage Timeouts of Members in the Server.
        case 'timeout':
          modAction = await modTimeout(
            interaction, guild, member, mod, reason, nextId, formatDuration, logChannel, beginTime, endTime, durationMs, timeoutUUID, durationToTomorrow, subCmd
          );
          break;
          // Manage Bans in the Server.
        case 'ban':
          modAction = await modBan(
            interaction, guild, user, mod, reason, nextId, formatDuration, logChannel, beginTime, endTime, durationMs, timeoutUUID, durationToTomorrow, subCmd
          );
          break;
        default: 
          const muteRole = await getMuteRole(guild.id);
          if (subCmd === 'mute' || subCmd === 'unmute') {
            const role = guild.roles.cache.find(r => r.id === muteRole);
            if (!role) {
              // No Mute Role set in Server.
              embed = createInfoEmbed({
                int: interaction,
                title: 'No Mute Role',
                descr: 'You haven\'t setup a Mute Role for this Server yet. \nUse `setup mute-role` to set one up.'
              });
              break;
            }
          }
          switch(subCmd) {
            // Manage Mutes in the Server.
            case 'mute':
              modAction = await modMute(
                interaction, guild, member, mod, reason, nextId, formatDuration, logChannel, beginTime, endTime, durationMs, muteRole, timeoutUUID, durationToTomorrow
              );
              break;
            // Manage Unmutes in the Server.
            case 'unmute':
              modAction = await ModUnmute(
                interaction, guild, member, mod, reason, nextId, logChannel, beginTime, muteRole
              );
              break; 
            // Manage Kicks in the Server.
            case 'kick':
              modAction = await modKick(
                interaction, guild, member, mod, reason, nextId, logChannel, beginTime
              );
              break;
            // Manage Unbans in the Server.
            case 'unban':
              modAction = await modUnban(
                interaction, guild, user, mod, reason, nextId, logChannel, beginTime
              );
              break;
          }
          break;
      }
    } catch (error) {
      console.error('Error executing moderation command:', error);
    }

    if (modAction.embeds.length === 0) {
      modAction.embeds.push(createSuccessEmbed({
        int: interaction,
        title: modAction.title,
        descr: modAction?.description ? modAction.description : null,
      }));
    }

    if (modAction?.usePagination && modAction.usePagination) {
      await pagination(interaction, modAction.embeds);
    } else {
      interaction.editReply({embeds: modAction.embeds});
    }
  }
};