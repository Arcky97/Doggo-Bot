const { PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { setLevelSettings, getRoleOrChannelMultipliers, getLevelSettings } = require("../../../database/levelSystem/setLevelSettings");
const setArrayValues = require("../../utils/setArrayValues");
const createListFromArray = require("../../utils/settings/createListFromArray");

module.exports = {
  name: 'levels',
  description: 'Level System Management.',
  options: [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'multiplier',
      description: 'Setup various Multipliers for the Level System',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'global',
          description: 'Set the Global XP Multiplier.',
          options: [
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'The Global XP Multiplier.',
              required: true,
              minValue: 1.0,
              maxValue: 10.0
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'channel',
          description: 'add/remove the XP Multiplier for 1 or more Channels.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'name',
              description: 'The Channel name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'The Channel Multiplier.',
              minValue: 1.0,
              maxValue: 10.0,
              required: true,
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'role',
          description: 'Add/remove the XP Multiplier for 1 or more Roles.',
          options: [
            {
              type: ApplicationCommandOptionType.Role,
              name: 'name',
              description: 'The Role name.',
              required: true 
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'The Role Multiplier.',
              minValue: 1.0,
              maxValue: 10.0,
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'settings',
          description: 'Shows the Settings set for Multipliers of the Level System.'
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'announcement',
      description: 'Setup the announcement Channel and whether to Ping on each level up.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'channel',
          description: 'The announcement Channel',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'name',
              description: 'The Channel name',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'ping',
          description: 'Wether to Ping on level up.',
          options: [
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'value',
              description: 'True or False',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'message',
          description: 'The announcement message.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'description',
              description: 'The level up message description.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'title',
              description: 'The title of the level up message.',
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'thumbnail',
              description: 'Wether to show the user thumbnail.'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'image',
              description: 'Add an image or gif to the level up message.'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'footer',
              description: 'The footer of the level up message.'
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'timestamp',
              description: 'Wether to show the time stamp on the level up message.'
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'blacklist',
      description: 'Add Channels and/or Roles that will not earn any XP at all.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'channel',
          description: "Add/remove a Channel to the black list that won't give XP.",
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'action',
              description: 'add/remove a Channel from the blacklist.',
              required: true,
              choices: [
                {
                  name: 'add',
                  value: 'add'
                },
                {
                  name: 'remove',
                  value: 'remove'
                }
              ]
            },
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'name',
              description: 'The Channel name.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'role',
          description: "Add a Role to the black list that won't give XP (mention the same channel to remove it.)",
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'action',
              description: 'add/remove a Role from the blacklist.',
              required: true,
              choices: [
                {
                  name: 'add',
                  value: 'add'
                },
                {
                  name: 'remove',
                  value: 'remove'
                }
              ]
            },
            {
              type: ApplicationCommandOptionType.Role,
              name: 'name',
              description: 'The Role name.',
              required: true 
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'roles',
      description: 'Add a role that can be earned by reaching a specific level',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'replace',
          description: 'sets roles to accumulate/replace upon the next level up role.',
          options: [
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'value',
              description: 'Replace (true) or Don\'t replace (false).',
              required: true,
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'add',
          description: 'Add a new level-role pair.',
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'level',
              description: 'The level',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Role,
              name: 'role',
              description: 'The role',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'edit',
          description: 'Edit or overwrite an exisiting level-role pair',
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'level',
              description: 'The level',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Role,
              name: 'role',
              description: 'The role',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'remove',
          description: 'Remove an existing level-role pair',
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'level',
              description: 'The level',
              required: true 
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'cooldown',
      description: 'Set the time for the cooldown between messages that will give the user XP',
      options: [
        {
          type: ApplicationCommandOptionType.Number,
          name: 'value',
          description: 'Set the cooldown value',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'voice',
      description: 'Enable XP earning through voice channels and set the cooldown and XP earned.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'setting',
          description: 'Enable/Disable earning XP through Voice Chat activity.',
          options: [
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'value',
              description: 'your input.',
              required: true 
            }
          ]
        }, 
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'multiplier',
          description: 'Set the multiplier for earning XP through Voice Chat activity.',
          options: [
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'the amount of XP.',
              minValue: 1,
              maxValue: 100,
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'cooldown',
          description: 'Set the cooldown for the time to pass before XP is earned again during Voice Activity.',
          options: [
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'The cooldown value.',
              minValue: 1,
              required: true
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'settings',
      description: 'Shows all Settings regarding the Level System.'
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    let levSettings, embed, globalMult, roleMults, channelMults, levelRoles, annMess, blackListRoles, blackListChannels;
    try {
      levSettings = await getLevelSettings(guildId);
      if (levSettings) {
        globalMult = levSettings.globalMultiplier
        roleMults = createListFromArray(levSettings.roleMultipliers, '- `${value}%` - <@&${roleId}>');
        channelMults = createListFromArray(levSettings.channelMultipliers, '- `${value}%` - <#${channelId}>'); 
        levelRoles = createListFromArray(levSettings.levelRoles, 'lv. ${level} - <@&${roleId}>');
        annMess = JSON.parse(levSettings.announcementMessage);
        blackListRoles = createListFromArray(levSettings.blackListRoles, '- <@&${roleId}>');
        blackListChannels = createListFromArray(levSettings.blackListChannels, '- <#${channelId}>');
      }
    } catch (error) {
      console.log('Error retrieving level system settings', error);
    }

    await interaction.deferReply();

    try {
      let data, setting, action, setData;

      switch(subCmdGroup) {
        case 'multiplier':
          const value = Math.floor(interaction.options.get('value')?.value * 100);
          if (subCmd !== 'global' && subCmd !== 'settings') {
            data = await getRoleOrChannelMultipliers({ id: guildId, type: subCmd });
            if (!data) data = [];
          }
          switch(subCmd) {
            case 'global':
              setting = { 'globalMultiplier': value };
              await interaction.editReply(`The Global Multiplier was set to ${value}!`);
              break;
            case 'channel':
              const channelId = interaction.options.get('name').value;
              [action, setData] = await setArrayValues(channelId, value, data, 'channel')
              setting = { 'channelMultipliers': setData};
              await interaction.editReply(`The ${subCmd} ${subCmdGroup} has been ${action} for <#${channelId}>.`);
              break
            case 'role':
              const roleId = interaction.options.get('name').value;
              [action, setData] = await setArrayValues(roleId, value, data, 'role')
              setting = { 'roleMultipliers': setData };
              await interaction.editReply(`The ${subCmd} ${subCmdGroup} has been ${action} for <@&${roleId}>.`);
              break;
            case 'settings':
              embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Level System Multipliers')
                .setDescription('All multipliers set in this Server are shown below.' + 
                  '\nThe max stack of multipliers is `1000%`.' +
                  '\n- Global + Roles Stack' +
                  '\n- Channel + Roles Stack' +
                  '\n- Global + Channel don\'t stack')
                .setFields(
                  {
                    name: 'Global Multiplier',
                    value: levSettings.globalMultiplier ? `\`${globalMult}%\`` : 'not set',
                    inline: true 
                  },
                  {
                    name: 'Role Multipliers',
                    value: roleMults,
                    inline: true 
                  },
                  {
                    name: 'Channel Multipliers',
                    value: channelMults,
                    inline: true
                  }
                )
                .setTimestamp()
              await interaction.editReply({ embeds: [embed] });
          }
          break;
        case 'announcement':

          break;
        case 'blacklist':

          break;
        case 'roles':

          break;
        case 'voice':
          action = 'insert'
          setting = interaction.options.getBoolean('value') 
          await interaction.editReply(`Voice XP has been ${voiEn ? 'Enabled' : 'Disabled'}!`);
          break;
        default:
          if (subCmd === 'cooldown') {

          } else { // subCmd === 'settings'
            if (levSettings) {
              embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('Level System Settings')
                .setDescription('All Settings set for this Server of the Level System are shown below.' +
                  '\nUse `/levels multiplier settings` to view all Multipliers for this Server.' + 
                  '\nUse `/levels role settings` to view all Level Roles for this Server.' +
                  '\nUse `/levels blacklist settings` to view all blacklisted Roles and Channels for this Server.'
                )
                .setFields(
                  {
                    name: 'Global Multiplier',
                    value: levSettings.globalMultiplier ? `\`${globalMult}%\`` : 'not set',
                    inline: true
                  },
                  {
                    name: 'Role Multipliers',
                    value: roleMults !== 'none' ? `${JSON.parse(levSettings.roleMultipliers).length} Role(s)` : roleMults,
                    inline: true
                  },
                  {
                    name: 'Channel Multipliers', 
                    value: channelMults !== 'none' ? `${JSON.parse(levSettings.channelMultipliers).length} Channel(s)` : channelMults,
                    inline: true  
                  },
                  {
                    name: 'Cooldown',
                    value: `${levSettings.xpCooldown} seconds`,
                    inline: true 
                  },
                  {
                    name: 'Replace Roles',
                    value: levSettings.roleReplace ? 'Replace' : 'Do not replace',
                    inline: true
                  },
                  {
                    name: 'Level Roles', 
                    value: levelRoles,
                    inline: true 
                  },
                  {
                    name: 'Clear on Leave',
                    value: levSettings.clearOnLeave ? 'Enabled' : 'Disabled',
                    inline: true
                  },
                  {
                    name: 'Black Listed Roles',
                    value: blackListRoles !== 'none' ? `${blackListRoles.length} Role(s)` : blackListRoles,
                    inline: true 
                  },
                  {
                    name: 'Black Listed Channels',
                    value: blackListChannels !== 'none' ? `${blackListChannels.length} Channel(s)` : blackListChannels,
                    inline: true 
                  },
                  {
                    name: 'Announcement Channel',
                    value: levSettings.announcementId !== 'not set' ? `<#${levSettings.announcementId}>` : 'Not set',
                    inline: true 
                  },
                  {
                    name: 'Announcement Ping',
                    value: levSettings.announcementPing ? 'Ping' : 'Don\'t ping',
                    inline: true 
                  },
                  {
                    name: 'Announcement Message',
                    value: annMess.length === 0 ? 'Default' : 'Custom set.', 
                    inline: true 
                  },
                  { 
                    name: 'Voice XP',
                    value: levSettings.voiceEnable ? 'Enabled' : 'Disabled',
                    inline: true 
                  }
                )
                .setFooter(
                  {
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL()
                  }
                )
                .setTimestamp();
                if (levSettings.voiceEnable) {
                  embed.addFields(
                    {
                      name: 'Voice Multiplier',
                      value: `\`${levSettings.voiceMultiplier * 100}%\``,
                      inline: true 
                    },
                    {
                      name: 'Voice Cooldown',
                      value: levSettings.voiceCooldown > 1 ? `${levSettings.voiceCooldown} Seconds` : `${levSettings.voiceCooldown} Second`,
                      inline: true 
                    }
                  )
                }
            } else {
              embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Level System Settings')
                .setDescription('No Settings available.')
                .setTimestamp()
            }
            await interaction.editReply({ embeds: [embed] });
          }
          break;
      }
      if (subCmd !== 'settings') {
        await setLevelSettings({ 
          id: guildId, 
          action,
          setting
        });
      }
    } catch (error) {
      console.error('Error with the levels command:', error);
      interaction.editReply('There was an error...');
    }
  }
}