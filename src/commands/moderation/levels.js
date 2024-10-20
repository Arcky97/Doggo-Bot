const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const { setLevelSettings, getRoleOrChannelMultipliers, getLevelSettings } = require("../../../database/levelSystem/setLevelSettings");
const setArrayValues = require("../../utils/setArrayValues");
const createListFromArray = require("../../utils/settings/createListFromArray");
const showMultiplierSettings = require("../../utils/levels/showMultiplierSettings");
const showLevelSystemSettings = require("../../utils/levels/showLevelSystemSettings");
const createErrorEmbed = require("../../utils/createErrorEmbed");

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
              minValue: 0.01,
              maxValue: 5.0
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
              minValue: 0.01,
              maxValue: 5.0,
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
              minValue: 0.01,
              maxValue: 5.0,
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
          required: true,
          minValue: 1,
          maxValue: 60
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

    await interaction.deferReply();

    let levSettings, embed, globalMult, roleMults, channelMults, levelRoles, annMess, blackListRoles, blackListChannels;
    try {
      levSettings = await getLevelSettings(guildId);
      if (levSettings && subCmd === 'settings') {
        console.log('we do this because the sub command includes settings');
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
      embed = createErrorEmbed(
        interaction, 
        'Oh no! Something went wrong trying to access the Level Settings for your server, please try again later!'
      );
      await interaction.editReply({ embeds: [embed] });
      return; 
    }

    let value = interaction.options.get('value')?.value 
    try {
      let data, setting, action, setData;

      switch(subCmdGroup) {
        case 'multiplier':
          value = Math.round(value * 100);
          console.log(value);
          if (subCmd !== 'global' && subCmd !== 'settings') {
            data = await getRoleOrChannelMultipliers({ id: guildId, type: subCmd }) || [];
          }
          switch(subCmd) {
            case 'global':
              setting = { 'globalMultiplier': value };
              await interaction.editReply(`The Global Multiplier has been set to ${value}%!`);
              break;
            case 'channel':
              const channel = interaction.options.getChannel('name');
              [action, setData] = await setArrayValues(channel.id, value, data, 'channel')
              setting = { 'channelMultipliers': setData};
              await interaction.editReply(`The ${subCmd} ${subCmdGroup} has been ${action} for ${channel}.`);
              break
            case 'role':
              const role = interaction.options.getRole('name');
              [action, setData] = await setArrayValues(role.id, value, data, 'role')
              setting = { 'roleMultipliers': setData };
              await interaction.editReply(`The ${subCmd} ${subCmdGroup} has been ${action} for <@&${role}>.`);
              break;
            case 'settings':
              embed = showMultiplierSettings(levSettings, globalMult, roleMults, channelMults);
              await interaction.editReply({ embeds: [embed] });
          }
          break;
        case 'announcement':
          switch(subCmd) {
            case 'channel':
              const channel = interaction.options.getChannel('name');
              setting = { 'announcementChannel': channel.id };
              await interaction.editReply(`The level up announcement channel has been set to ${channel}`);
              break;
            case 'ping':
              value = interaction.options.getBoolean('value');
              console.log(value);
              setting = { 'announcementPing': value};
              await interaction.editReply(`The ping has been turned ${value ? 'on' : 'off'} for level up announcements.`);
              break;
            case 'message':
              
              break;
          }
          break;
        case 'blacklist':

          break;
        case 'roles':

          break;
        case 'voice':
          switch(subCmd){
            case 'setting':
              setting = {'voiceEnable': interaction.options.getBoolean('value') };
              await interaction.editReply(`Voice XP has been ${setting ? 'Enabled' : 'Disabled'}!`);
              break;
            case 'multiplier':
              value = Math.round(value * 100);
              setting = {'voiceMultiplier': value};
              await interaction.editReply(`Voice Multiplier has been set to ${value}%`);
              break;
            case 'cooldown':
              setting = {'voiceCooldown': value};
              await interaction.editReply(`Voice cooldown has been set to ${value} ${value > 1 ? 'seconds' : 'second'}!`);
              break;
          }
          break;
        default:
          if (subCmd === 'cooldown') {
            setting = { 'xpCooldown' : value };
            await interaction.editReply(`The XP cool down has been set to ${value} ${value > 1 ? 'seconds' : 'second'}!`);
          } else { // subCmd === 'settings'
            embed = showLevelSystemSettings(interaction, levSettings, globalMult, roleMults, channelMults, levelRoles, blackListRoles, blackListChannels, annMess)
            await interaction.editReply({ embeds: [embed] });
          }
          break;
      }
      if (subCmd !== 'settings') {
        await setLevelSettings({ 
          id: guildId,
          setting
        });
      }
    } catch (error) {
      console.error('Error with the levels command:', error);
      embed = createErrorEmbed(interaction, 'There was an error...');
      interaction.editReply({ embeds: [embed] });
    }
  }
}