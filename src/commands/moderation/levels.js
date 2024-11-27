const { PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { setLevelSettings, getRoleOrChannelMultipliers, getLevelSettings, getRoleOrChannelBlacklist, getLevelRoles, resetLevelSettings } = require("../../../database/levelSystem/setLevelSettings");
const { setChannelOrRoleArray, setAnnounceLevelArray, setLevelRolesArray } = require("../../utils/setArrayValues");
const createListFromArray = require("../../utils/settings/createListFromArray");
const showMultiplierSettings = require("../../utils/levels/showMultiplierSettings");
const showLevelSystemSettings = require("../../utils/levels/showLevelSystemSettings");
const getOrConvertColor = require("../../utils/getOrConvertColor");
const showAnnouncementSettings = require("../../utils/levels/showAnnouncementSettings");
const embedPlaceholders = require("../../utils/embeds/embedPlaceholders");
const showBlacklistSettings = require("../../utils/levels/showBlacklistSettings");
const showVoiceSettings = require("../../utils/levels/showVoiceSettings");
const { resetLevelSystem, getAllUsersLevel, getUserLevel, setUserLevelInfo } = require("../../../database/levelSystem/setLevelSystem");
const { createErrorEmbed, createSuccessEmbed, createWarningEmbed, createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const getChannelTypeName = require("../../utils/logging/getChannelTypeName");
const firstLetterToUpperCase = require("../../utils/firstLetterToUpperCase");
const getVowel = require("../../utils/getVowel");
const createAnnounceEmbed = require("../../utils/levels/createAnnounceEmbed");
const calculateLevelByXp = require("../../utils/levels/calculateLevelByXp");
const calculateXpByLevel = require("../../utils/levels/calculateXpByLevel");
const calculateMultiplierXp = require("../../utils/levels/calculateMultiplierXp");
const getMemberRoles = require("../../utils/logging/getMemberRoles");

module.exports = {
  name: 'lvsys',
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
          description: 'Add/Remove the XP Multiplier for 1 or more Channels.',
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
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'replace',
              description: 'Whether the Channel Multiplier should replace the Category/Global.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'category',
          description: 'Add/Remove the XP Multiplier for 1 or more Categories.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'name',
              description: 'The Category name.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'The Category Multiplier.',
              minValue: 0.01,
              maxValue: 5.0,
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'role',
          description: 'Add/Remove the XP Multiplier for 1 or more Roles.',
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
          name: 'replace',
          description: 'Whether Channel and or Category Multipliers replace other Multipliers. (Except Role Multipliers.)',
          options: [
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'category',
              description: 'Category Multipliers replace or stack with Global Multipliers.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'channel',
              description: 'Channel Multipliers replace or stack with Category/Global Multipliers.',
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
      name: 'announce',
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
              type: ApplicationCommandOptionType.Integer,
              name: 'level',
              description: 'The level the level up message belongs to.',
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'color',
              description: 'The color of the level up message. (type `{user color}` for the user\'s Rank Card Color.)'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'title',
              description: 'The title of the level up message.',
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'thumbnailurl',
              description: 'Wether to show the user thumbnail.'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'imageurl',
              description: 'Add an image or gif to the level up message.'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'footer',
              description: 'The level up message\'s footer. (When set to `{server name}`, the server icon is used by default.)'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'footericonurl',
              description: 'Add a footer icon to the level up message.'
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'timestamp',
              description: 'Wether to show the time stamp on the level up message.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'remove',
          description: 'remove a level up announcement message.',
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'level',
              description: 'the level the level up message belongs to.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'settings',
          description: 'Shows the settings set for the announcement messages'
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'show',
          description: 'Shows the Default Level up message or from a specific level if specified',
          options: [
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'level',
              description: 'The level the level up message belongs to.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'placeholders',
          description: 'Shows a list of all placeholders you can use for the level up announcement messages.',
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
          description: 'Add a Channel to the black list that won\'t give XP.',
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
          name: 'category',
          description: 'Add a Category to the black list that won\'t give XP.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'name',
              description: 'The Category name.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'role',
          description: 'Add a Role to the black list that won\'t give XP (mention the same channel to remove it.)',
          options: [
            {
              type: ApplicationCommandOptionType.Role,
              name: 'name',
              description: 'The Role name.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'settings',
          description: 'Shows the Settings set for the Black List Roles and Channels of the Level System.'
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'roles',
      description: 'Add a role that can be earned by reaching a specific level.',
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
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'xp',
      description: 'Set various xp settings.',
      options: [
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
          type: ApplicationCommandOptionType.Subcommand,
          name: 'values',
          description: 'Set various values for calculating xp and level xp requirement.',
          options: [
            {
              type: ApplicationCommandOptionType.Number,
              name: 'step',
              description: 'The Step is used in the formula to calculate the XP requirement for each level. (default 40)',
              required: true,
              minValue: 10,
              maxValue: 200,
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'min',
              description: 'The Minimum XP (without multipliers) that can be earned for each message giving XP.',
              required: true,
              minValue: 1,
              maxValue: 100
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'max',
              description: 'The Maximum XP (without multipliers) that can be earned for each message giving XP.',
              required: true,
              minValue: 1,
              maxValue: 100
            }
          ]
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
          name: 'use',
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
              maxValue: 500,
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
              minValue: 10,
              maxValue: 300,
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'settings',
          description: 'Shows  the Settings set for the Voice xp of the Level system.'
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'settings',
      description: 'Shows all Settings regarding the Level System.'
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'reset',
      description: 'Reset the Levels and/or all the Level System Settings.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'settings',
          description: 'Reset all the Level System Settings. (Cannot be undone!)',
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'levels',
          description: 'Reset all the Levels or from a User. (Cannot be undone!)',
          options: [
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'user',
              description: 'The User who you want to reset the level from.'
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'modify',
      description: 'Change a User\'s Level or XP.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'level',
          description: 'Change a User\'s Level.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'action',
              description: 'Add or Remove x Levels or set the Level.',
              required: true,
              choices: [
                {
                  name: 'add',
                  value: 'add'
                },
                {
                  name: 'set',
                  value: 'set'
                },
                {
                  name: 'remove',
                  value: 'remove'
                }
              ]
            },
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'user',
              description: 'The User to modify it\'s Level.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'The Level to Add, Remove or set.',
              required: true,
              minValue: 1,
              maxValue: 999
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'xp',
          description: 'Change a User\'s XP.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'action',
              description: 'Add or Remove an amount of XP or set to a specific amount.',
              required: true,
              choices: [
                {
                  name: 'add',
                  value: 'add'
                },
                {
                  name: 'set',
                  value: 'set'
                },
                {
                  name: 'remove',
                  value: 'remove'
                }
              ]
            },
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'user',
              description: 'The User to modify it\'s XP.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: 'value',
              description: 'The XP to Add, Remove or Set.',
              required: true,
              minValue: 1,
              maxValue: 99999
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'calculator',
      description: 'The Level Calculator is a handy tool!',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'xp',
          description: 'Calculate how much xp you gain on given conditions.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel (used for the eventual multiplier). (if not given, the current channel will be used.)'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'roles',
              description: '1 or more Roles which will overwrite the User\'s Roles. (Separate each with \';\'.)'
            },
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'user',
              description: 'The User to use it\'s Roles from (if not given, your Roles will be used).',
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'messages',
          description: 'Calculate how many messages need to be sent to reach a certain level.',
          options: [
            {
              type: ApplicationCommandOptionType.Number,
              name: 'level',
              description: 'The wanted level.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'remain',
              description: 'The remaining levels until reaching the wanted level.',
            },
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel (used for the eventual multiplier). (If not given, the current channel will be used.)'
            },
            {
              type: ApplicationCommandOptionType.Mentionable,
              name: 'user',
              description: 'The User to use it\'s Roles from (if not given, your Roles will be used).'
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'roles',
              description: '1 or more Roles which will overwrite the User\'s Roles. (Separate each with \';\'.)'
            }
          ]
        }
      ]
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    await interaction.deferReply();

    let levSettings, embed, globalMult, roleMults, channelMults, categoryMults, levelRoles, annMess, blackListRoles, blackListChannels, blackListCategories;
    try {
      levSettings = await getLevelSettings(guildId);
      if (levSettings && subCmd === 'settings') {
        globalMult = levSettings.globalMultiplier
        roleMults = createListFromArray(levSettings.roleMultipliers, '- `${value}%` - <@&${roleId}>');
        channelMults = createListFromArray(levSettings.channelMultipliers, '- `${value}%` - <#${channelId}>');
        categoryMults = createListFromArray(levSettings.categoryMultipliers, '- `${value}%` - <#${categoryId}>');
        levelRoles = createListFromArray(levSettings.levelRoles, 'lv. ${level} - <@&${roleId}>');
        annMess = JSON.parse(levSettings.announceLevelMessages);
        blackListRoles = createListFromArray(levSettings.blackListRoles, '- <@&${roleId}>');
        blackListChannels = createListFromArray(levSettings.blackListChannels, '- <#${channelId}>');
        blackListCategories = createListFromArray(levSettings.blackListCategories, '- <#${categoryId}>');
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

    const xpSettings = JSON.parse(levSettings.xpSettings)
    let value = interaction.options.get('value')?.value;
    try {
      let data, setting, existingSetting, action, setData, role, channel, level, user;

      switch(subCmdGroup) {
        case 'multiplier':
          value = Math.round(value * 100);
          const replace = interaction.options.getBoolean('replace') || false;
          if (subCmd !== 'global' && subCmd !== 'settings') {
            data = await getRoleOrChannelMultipliers({ id: guildId, type: subCmd }) || [];
          }
          switch(subCmd) {
            case 'global':
              setting = { 'globalMultiplier': value };
              embed = createSuccessEmbed({int: interaction, title: 'Global Multiplier Set!', descr: `The Global Multiplier has been set to \`${value}%\`!`});
              break;
            case 'channel': // check if subCmd is 'channel'
            case 'category': // check if subCmd is 'category'
              channel = interaction.options.getChannel('name');
              const channelTypeName = getChannelTypeName(channel);
              if ([0, 2, 4].some(type => type === channel.type)) {
                if ((subCmd === 'channel' && channel.type === 4) || (subCmd === 'category' && (channel.type === 2 || channel.type === 0))) {
                  embed = createWarningEmbed({int: interaction, title: 'Multiplier not Set!', descr: `${channel} is not a ${firstLetterToUpperCase(subCmd)}.\n Please use \`/lvsys ${subCmdGroup} ${subCmd === 'channel' ? 'category' : 'channel'}\` instead.`});
                } else if (interaction.guild.afkChannelId !== channel.id) {
                  [action, setData] = setChannelOrRoleArray({ type: subCmd, data: data, id: channel.id, value: value, replace: replace });
                  setting = { [`${subCmd}Multipliers`]: setData };
                  embed = createSuccessEmbed({int: interaction, title: `${firstLetterToUpperCase(subCmd)} Multiplier ${action}!`, descr: `The ${firstLetterToUpperCase(subCmd)} Multiplier for ${channel} has been ${action !== 'removed' ? `set to \`${value}%\`` : action}!\nThe ${firstLetterToUpperCase(subCmd)} Multiplier will ${replace ? 'now replace' : 'stack up with'} the ${subCmd === 'channel' ? 'Category/Global' : 'Global'} Multiplier.`});
                } else {
                  embed = createWarningEmbed({int: interaction, title: 'Multiplier not Set!', descr: `${channel} is set as AFK Voice Channel for this Server and can't have a multiplier. \n(You can't earn XP there anyway.)`});
                }
              } else {
                embed = createWarningEmbed({int: interaction, title: 'Channel Type not supported!', descr: `Setting a Channel Multiplier for ${channelTypeName} is not supported!`});
              }
              break
            case 'role':
              role = interaction.options.getRole('name');
              if (role.id !== guildId) {
                [action, setData] = setChannelOrRoleArray({ type: 'role', data: data, id: role.id, value: value });
                setting = { 'roleMultipliers': setData };
                embed = createSuccessEmbed({int: interaction, title: `Role Multiplier ${action}!`, descr: `The ${subCmd} ${subCmdGroup} for ${role} has been ${action !== 'removed' ? `set to \`${value}%\`` : action }!`});
              } else {
                embed = createWarningEmbed({int: interaction, descr: `A Role Multiplier can't be set for ${role}.`});
              }
              break;
            case 'replace':
              const catRepl = interaction.options.getBoolean('category');
              const chanRepl = interaction.options.getBoolean('channel');
              const multRepl = JSON.parse(levSettings.multiplierReplace);
              if (catRepl !== multRepl.category || chanRepl !== multRepl.channel) {
                setData = JSON.stringify({
                  'category': catRepl,
                  'channel': chanRepl
                });
                setting = { 'multiplierReplace': setData };
                embed = createSuccessEmbed({int: interaction, title: 'Multiplier Settings Updated', descr: `The Category and Channel Multiplier Replace Settings have been updated!`});
              }
              break;
            case 'settings':
              embed = showMultiplierSettings(levSettings, globalMult, roleMults, channelMults, categoryMults);

              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'announce':
          let embedOptions;
          switch(subCmd) {
            case 'channel':
              existingSetting = levSettings.announceChannel;
              channel = interaction.options.getChannel('name');
              if (existingSetting !== channel.id) {
                setting = { 'announceChannel': channel.id };
                embed = createSuccessEmbed({int: interaction, title: `Level Up Announce Channel ${existingSetting ? 'Updated' : 'Set'}!`, descr: `The Level Up Announce Channel has been ${existingSetting ? 'updated' : 'set'} to ${channel}.`});
              } else {
                embed = createInfoEmbed({ int: interaction, descr: `The Level Up Announce Channel has already been set to <#${existingSetting}>.`});
              }
              break;
            case 'ping':
              existingSetting = levSettings.announcePing === 1;
              if (existingSetting !== value) {
                setting = { 'announcePing': value};
                embed = createSuccessEmbed({int: interaction, title: 'The Level Up Announce Ping Updated!', descr: `The ping has been ${value ? '\`enabled\`' : '\`disabled\`'}.`});
              } else {
                embed = createInfoEmbed({int: interaction, descr: `The Level Up Announce Ping is already ${value ? '\`enabled\`' : '\`disabled\`'}.`});
              }
              break;
            case 'message':
              const color = interaction.options.getString('color');
              embedOptions = {
                title: interaction.options.getString('title') || '{user global} has leveled up!',
                description: interaction.options.getString('description') || '{Congrats you leveled up to lv. {level}!',
                color: color.startsWith('{') ? color : await getOrConvertColor(color) || '{user color}',
                thumbnailUrl: interaction.options.getBoolean('thumbnailurl') ? '{user avatar}' : null,
                imageUrl: interaction.options.getString('imageurl'),
                footer: {
                  text: interaction.options.getString('footer') || '{server name}',
                  iconUrl: interaction.options.getString('footericonurl') || '{server icon}'
                },
                timeStamp: interaction.options.getBoolean('timestamp')
              }
              level = interaction.options.getInteger('level');
              if (level) {
                [action, setData] = setAnnounceLevelArray(levSettings, {lv: level, options: embedOptions});
                setting = { 'announceLevelMessages': setData};
                embed = createSuccessEmbed({ int: interaction, title: `Level Up Message ${action}!`, descr: `The Level Up Message for lv. ${level} has been ${action}! \nUse \`/lvsys announce show level: ${level}\` to view it.`});
              } else {
                setting = { 'announceDefaultMessage': JSON.stringify(embedOptions) };
                embed = createSuccessEmbed({int: interaction, title: 'Level Up Message Updated!', descr: 'The default Level Up Message has been updated! \nUse `/lvsys announce show ` to view it.'});
              }
              break;
            case 'remove':
              level = interaction.options.getInteger('level');
              [action, setData] = setAnnounceLevelArray(levSettings, level);
              setting = { 'announceLevelMessages': setData};
              if (action !== 'error') {
                embed = createSuccessEmbed({int: interaction, title: 'Level Up Message Removed!', descr: `The Level Up Message for lv. ${level} has been ${action}.`});
              } else {
                embed = createInfoEmbed({int: interaction, title: 'Level Up Message not found!', descr: `The Level Up Message for lv. ${level} does not exist!`});
              }
              break;
            case 'settings':
              embed = showAnnouncementSettings(levSettings);
              break;
            case 'show':
              level = interaction.options.getInteger('level');
              if (level) {
                embedOptions = JSON.parse(levSettings.announceLevelMessages).find(data => data.lv === level)?.options;
              } else {
                embedOptions = JSON.parse(levSettings.announceDefaultMessage);
              }
              const userInfo = await getUserLevel(guildId, interaction.user.id);
              const userLevelInfo = {
                "guildId": guildId,
                "memberId": interaction.user.id,
                "level": level || userInfo.level,
                "xp": calculateLevelByXp((level || userInfo.level), xpSettings),
                "color": userInfo.color
              };
              embed = await createAnnounceEmbed(guildId, interaction, userLevelInfo);
              break;
            case 'placeholders':
              const fieldObject = {
                "user": [
                  '{user id}** (The user\'s ID)',
                  '{user mention}** (Mention the User)',
                  '{user name}** (The user\'s name)',
                  '{user global}** (The user\'s Global name)',
                  '{user nick}** (The User\'s nickname)',
                  '{user avatar}** (The user\'s Avatar Url)',
                  '{user color}** (The user\'s Rank Card Color)'
                ],
                "level and xp": [
                  '{user xp}** (The user\'s current level XP)',
                  '{level}** (The user\'s current level)',
                  '{level previous}** (The user\'s previous level)',
                  '{level previous xp}** (The user\'s previous level XP)',
                  '{level next}** (The user\'s next level)',
                  '{level next xp}** (The user\'s next level XP)'
                ],
                "level awards": [
                  '{reward}** (The Reward Role)',
                  '{reward role name}** (The Reward Role\'s name)',
                  '{reward rolecount}** (The total Reward Count)',
                  '{reward rolecount progress}** (The Reward progress in {reward rolecount progress} format)', '{reward previous} (The previous Reward Role)',
                  '{reward next}** (The next Reward Role)'
                ],
                "server": [
                  '{server id}** (The Server\'s ID)',
                  '{server name}** (The Server\'s name)',
                  '{server member count}** (The total Members in the Server)',
                  '{server icon}** (The Server Icon Url)'
                ],
                "other" : [
                  '{new line} (Add a new line)**'
                ]
              }
              embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Announce Level Up Message Placeholders')
                .setTimestamp()
              for (const [key, placeholders] of Object.entries(fieldObject)) {
                const values = await Promise.all(
                  placeholders.map(async (placeholder) => `\`${placeholder.split('}')[0] + '}'}\` = **${await embedPlaceholders(placeholder, interaction)}`)
                );
                const valueString = values.join('\n - ').trim();
                embed.addFields(
                  {
                    name: key,
                    value: `- ${valueString}`
                  }
                )
              };
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'blacklist':
          data = await getRoleOrChannelBlacklist({id: guildId, type: subCmd }) || [];
          switch (subCmd) {
            case 'channel':
            case 'category':
              channel = interaction.options.getChannel('name');
              const channelTypeName = getChannelTypeName(channel);
              if ([0, 2, 4].some(type => type === channel.type)) {
                if ((subCmd === 'channel' && channel.type === 4) || (subCmd === 'category' && (channel.type === 2 || channel.type === 0))) {
                  embed = createWarningEmbed({int: interaction, title: 'Black List not Updated', descr: `${channel} is not a ${firstLetterToUpperCase(subCmd)}.\n Please use \`lvsys ${subCmdGroup} ${subCmd === 'channel' ? 'category' : 'channel'}\` instead.`});
                } else if (interaction.guild.afkChannelId !== channel.id) {
                  [action, setData] = setChannelOrRoleArray({ type: subCmd, data: data, id: channel.id });
                  setting = { [`blackList${subCmd === 'channel' ? `${firstLetterToUpperCase(subCmd)}s` : `${subCmd.replace(/y$/, 'ies')}`}`] : setData };
                  embed = createSuccessEmbed({int: interaction, title: `${firstLetterToUpperCase(subCmd)} ${action}!`, descr: `${channel} has been ${action} to the Black List.`});
                } else {
                  embed = createWarningEmbed({int: interaction, title: 'Black List not Updated', descr: `Adding ${channel} to the Black List will have no effect as this Voice Channel is set as the AFK Channel. You can't earn XP in the AFK Voice Channel anyways.`});
                }
              } else {
                embed = createWarningEmbed({int: interaction, title: 'Channel Type not supported!', descr: `You can't add ${getVowel(channelTypeName)} to the ${firstLetterToUpperCase(subCmd)} Black List.`});
              }
              break;
            case 'role':
              role = interaction.options.getRole('name');
              [action, setData] = setChannelOrRoleArray({type: 'role', data: data, id: role.id});
              setting = { 'blackListRoles' : setData};
              embed = createSuccessEmbed({int: interaction, title: `Role ${action}!`, descr: `${role} has been ${action} to the Black List.`});
              break;
            case 'settings':
              embed = showBlacklistSettings(blackListRoles, blackListChannels, blackListCategories);
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'roles':
          data = await getLevelRoles(guildId) || [];
          level = interaction.options.getInteger('level');
          switch (subCmd) {
            case 'replace':
              existingSetting = levSettings.roleReplace === 1;
              if (existingSetting !== value) {
                setting = { 'roleReplace': value };
                embed = createSuccessEmbed({int: interaction, title: 'Replace Roles Setting', descr: `The Role Replace Setting has been ${value ? '\`enabled\`. \nRoles will be replaced upon gaining.' : '\`disabled\`. \nRoles will not be replaced upon gaining.'}`});
              } else {
                embed = createInfoEmbed({int: interaction, descr:`The Replace Roles Setting is already ${value ? '\`enabled\`' : '\`disabled\`' }.`});
              }
              break;
            case 'add':
              role = interaction.options.getRole('role');
              const match = data.find(dat => (dat.level !== level || dat.level === level) && dat.roleId === role.id)
              if (match) {
                embed = createInfoEmbed({int: interaction, title: 'Reward Role already added!', descr: `${role} has already been asigned as a reward for lv. ${match.level}.`});
              } else {
                [action, setData] = setLevelRolesArray(subCmd, data, level, role.id);
                setting = { 'levelRoles': setData };
                embed = createSuccessEmbed({int: interaction, title: `Reward Role ${action === 'set' ? 'Added' : action}!`, descr: `The Reward Role for lv. ${level} has been ${action} to ${role}.`})
              }
              break;
            case 'remove':
              [action, setData] = setLevelRolesArray(subCmd, data, level);
              setting = { 'levelRoles': setData};
              embed = createSuccessEmbed({int: interaction, title: `Reward Role ${action}!`, descr: `The Reward Role for lv. ${level} has been ${action}.`});
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'voice':
          switch(subCmd) {
            case 'use':
              existingSetting = levSettings.voiceEnable === 1;
              if (existingSetting !== value) {
                setting = {'voiceEnable': value };
                embed = createSuccessEmbed({int: interaction, title: `Voice XP ${value ? 'Enabled' : 'Disabled'}`, descr: `The Voice XP Setting has been ${value ? '\`Enabled\` \nYou can now' : '\`Disabled\` \nYou can no longer'} earn xp through Voice activity in the Server.`});
              } else {
                embed = createInfoEmbed({int: interaction, descr: `Voice XP is already ${value ? '\`Enabled\`' : '\`Disabled\`'}`});
              }
              break;
            case 'multiplier':
              existingSetting = levSettings.voiceMultiplier;
              value = Math.round(value);
              if (existingSetting !== value) {
                setting = {'voiceMultiplier': value};
                embed = createSuccessEmbed({int: interaction, title: `Voice Multiplier Updated!`, descr: `The Voice Multiplier has been updated to \`${value}%\`.`});
              } else {
                embed = createInfoEmbed({int: interaction, descr: `The Voice Multiplier was already set to \`${value}%\`.`});
              }
              break;
            case 'cooldown':
              existingSetting = levSettings.voiceCooldown;
              let minXp = JSON.parse(levSettings.xpSettings).min;
              let maxXp = JSON.parse(levSettings.xpSettings).max;
              if (existingSetting !== value) {
                setting = {'voiceCooldown': value};
                embed = createSuccessEmbed({int: interaction, title: 'Voice Cooldown Updated!', descr: `The Voice Cooldown has been updated to \`${value}\` ${value > 1 ? 'seconds' : 'second'}. \nYou'll now earn ${minXp + Math.round((minXp * levSettings.voiceMultiplier) / 100)} - ${maxXp + Math.round((maxXp * levSettings.voiceMultiplier) / 100)}xp for every ${value > 1 ? `${value} seconds` : 'second'} spent in Voice Activity.`})
              } else {
                embed = createInfoEmbed({int: interaction, descr: `Voice Cooldown has already been set to ${value} seconds.`});
              }
              break;
            case 'settings':
              embed = showVoiceSettings(levSettings);
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'reset':
          let levelData;
          switch(subCmd) {
            case 'settings':
              await resetLevelSettings(guildId);
              embed = createSuccessEmbed({int: interaction, title: 'Level Settings Resetted!', descr: 'All Level System Setting have been resetted.'})
              break;
            case 'levels':
              const member = interaction.options.getMentionable('user');
              if (member) {
                levelData = await getUserLevel(guildId, member.id);
                if (levelData) {
                  embed = createSuccessEmbed({int: interaction, title: 'User level resetted!', descr: `The level for ${member} has been resetted.`});
                  await resetLevelSystem(guildId, member);
                } else {
                  if (!member.user.bot) {
                    embed = createInfoEmbed({int: interaction, descr: `The level for ${member} has already been resetted.`});
                  } else {
                    embed = createInfoEmbed({int: interaction, descr: `You can't reset the level of ${member} (it's a bot).`});
                  }
                }
              } else {
                levelData = await getAllUsersLevel(guildId);
                if (levelData.length > 0) {
                  embed = createSuccessEmbed({int: interaction, title: 'All levels resetted!', descr: 'All levels have been resetted!'});
                  await resetLevelSystem(guildId, member);
                } else {
                  embed = createInfoEmbed({int: interaction, descr: 'All levels have already been resetted before.'});
                }
              }
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'xp':
          switch(subCmd) {
            case 'cooldown':
              existingSetting = levSettings.xpCooldown;
              if (existingSetting !== value) {
                setting = { 'xpCooldown' : value };
                embed = createSuccessEmbed({int: interaction, title: 'Xp Cooldown Updated!', descr: `The XP Cooldown has been updated to \`${value} ${value > 1 ? 'seconds' : 'second'}\`!`});
              } else {
                embed = createInfoEmbed({int: interaction, descr: `The XP Cooldown has already been set to \`${value} ${value > 1 ? 'seconds' : 'second'}\`!`});
              }
              break;
            case 'values':
              existingSetting = JSON.parse(levSettings.xpSettings);
              value = {
                step: interaction.options.getNumber('step'),
                min: interaction.options.getNumber('min'),
                max: interaction.options.getNumber('max')
              }
              if (JSON.stringify(existingSetting) !== JSON.stringify(value)) {
                const warningEmbed = createWarningEmbed({int: interaction, title: 'Warning: Level Reset Required', descr: `Changing XP values will reset all user levels to prevent XP discrepancies. \nDo you want to proceed?\n\n**New Values:**\n- Step: \`${value.step}\`\n- Min XP: \`${value.min}\`\n- Max XP: \`${value.max}\`\n\n**React with:** \n- ✅ to confirm \n- ❌ to cancel \n(You have 45 seconds to respond)`});

                interaction.editReply({ embeds: [warningEmbed] });
                const warningMessage = await interaction.fetchReply();

                await warningMessage.react('✅');
                await warningMessage.react('❌');

                const filter = (reaction, user) => {
                  return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
                };

                try {
                  const collected = await warningMessage.awaitReactions({ filter, max: 1, time: 45000, errors: ['time'] });
                  const reaction = collected.first();

                  if (reaction.emoji.name === '✅') {
                    let levelData = await getAllUsersLevel(guildId);
                    setting = { 'xpSettings' : JSON.stringify(value) };
                    embed = createSuccessEmbed({
                      int: interaction,
                      title: 'XP Values Updated!',
                      descr: `The XP Values have been updated ${levelData.length > 0 ? 'and all levels resetted' : 'but levels were not resetted \n(they have been recently)'}: \n- **Step:** \`${existingSetting.step}\` => \`${value.step}\` \n- **Min Xp:** \`${existingSetting.min}xp\` => \`${value.min}xp\` \n- **Max Xp:** \`${existingSetting.max}xp\` => \`${value.max}xp\``
                    });
                    if (levelData.length > 0) await resetLevelSystem(guildId);
                  } else if (reaction.emoji.name === '❌') {
                    embed = createInfoEmbed({
                      int: interaction,
                      descr: 'Operation canceled. Xp values remain unchanged.'
                    });
                  }
                } catch (error) {
                  embed = createInfoEmbed({
                    int: interaction,
                    descr: 'No response detected. XP values remain unchanged.'
                  });
                }
                try {
                  await warningMessage.reactions.removeAll();
                } catch (error) {
                  console.error('Failed to remove reactions:', error);
                }
              } else {
                embed = createWarningEmbed({
                  int: interaction,
                  descr: `The given step (\`${value.step}\`), min xp (\`${value.min}\`) and max xp (\`${value.max}\`) are the same as they were already set.`});
              }
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'modify':
          action = interaction.options.getString('action');
          user = interaction.options.getMentionable('user');
          const userLevelInfo = await getUserLevel(guildId, user.id);
          level = value;
          const xp = value;
          let levelToGive, xpToGive;
          switch (subCmd) {
            case 'level':
              switch (action) {
                case 'add':
                  levelToGive = Math.min(userLevelInfo.level + level, 999);
                  if (userLevelInfo.level + level > 999) {
                    embed = createInfoEmbed({ int: interaction, title: 'User Level not Modified!', descr: `${user}'s Level was not modifed because it exceeds the maximum level of 999!`});
                  }
                  break;
                case 'remove':
                  levelToGive = Math.max(userLevelInfo.level - level, 1);
                  if (userLevelInfo.level - level < 1) {
                    embed = createInfoEmbed({ int: interaction, title: 'User Level not Modified!', descr: `${user}'s Level was not modified because it exceeds the minimum level!`});
                  }
                  break;
                case 'set':
                  levelToGive = level;
                  if (level === userLevelInfo.level && calculateXpByLevel(level, xpSettings) === userLevelInfo.xp) {
                    embed = createInfoEmbed({ int: interaction, title: 'User Level not Modified!', descr: `${user}'s Level was not modified because the Level and XP are the same!`});
                  }
                  break;
              }
              if (!embed) {
                xpToGive = calculateXpByLevel(levelToGive, xpSettings)
                await setUserLevelInfo(userLevelInfo, { guildId: guildId, memberId: user.id }, { level: levelToGive, xp: xpToGive });
                embed = createSuccessEmbed({ int: interaction, title: 'User Level Modified!', descr: `${user}'s Level has been modified to Lv. ${levelToGive}!`});
              }
              break;
            case 'xp':
              switch (action) {
                case 'add':
                  xpToGive = userLevelInfo.xp + xp;
                  break;
                case 'remove':
                  xpToGive = Math.max(userLevelInfo.xp - xp, 1);
                  break;
                case 'set':
                  xpToGive = xp;
                  if (xp === userLevelInfo.xp) {
                    embed = createInfoEmbed({ int: interaction, title: 'User XP not Modified!', descr: `${user}'s XP was not modified because the XP is the same!`});
                  }
                  break;
              }
              levelToGive = calculateLevelByXp(xpToGive, xpSettings);
              if (levelToGive > 999) {
                embed = createInfoEmbed({ int: interaction, title: 'User XP not Modified!', descr: `${user}'s XP has not been modified because it exceeds the maximum level of 999!`});
              }
              if (!embed) {
                await setUserLevelInfo(userLevelInfo, { guildId: guildId, memberId: user.id }, { level: levelToGive, xp: xpToGive });
                embed = createSuccessEmbed({ int: interaction, title: 'User XP Modified!', descr: `${user}'s XP has been modified to ${xpToGive} XP!`});
              }
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
        case 'calculator':
          level = interaction.options.getNumber('level');
          user = interaction.options.getMentionable('user') || interaction.member;
          role = interaction.options.getString('roles');
          const userData = await getUserLevel(guildId, user.id);
          const startLevel = interaction.options.getBoolean('remain') ? userData.level : 0;
          let userRoles, description, catString, chanString, roleString;
          if (role) {
            if (role.includes(';')) {
              userRoles = role.split(';').map(s => s.trim()).filter(Boolean);
            } else {
              userRoles = [role.trim()];
            }
          } else {
            userRoles = getMemberRoles(user);
          }
          roleMults = JSON.parse(levSettings.roleMultipliers).filter(role => userRoles.includes(role.roleId));
          const usedRoleMults = createListFromArray(roleMults, '- <@&${roleId}>: `${value}%`', false);
          channel = interaction.options.getChannel('channel') || interaction.channel;
          if (channel.type === 4) {
            embed = createInfoEmbed({ int: interaction, title: 'Wrong Channel Type Given', descr: `${channel} is not a Category, please give a Text or Voice Channel instead to calculate the XP.`});
            interaction.editReply({ embeds: [embed]});
            return;
          }
          channelMults = JSON.parse(levSettings.channelMultipliers).filter(data => data.channelId === channel.id);
          categoryMults = JSON.parse(levSettings.categoryMultipliers).filter(data => data.categoryId === channel.parent?.id);
          let usedChanMults= 'none';
          let usedCatMults = 'none';
          if (categoryMults.length === 1) {
            if (channelMults.length === 1) usedChanMults = 'replaced by Category';
            usedCatMults = createListFromArray(categoryMults, '`${value}%`', false);
          } else {
            usedChanMults = createListFromArray(channelMults, '`${value}%`', false);
          }
          let xpObject = {
            settings: levSettings, 
            user: user, 
            channel: channel, 
            roles: userRoles,
            notRandom: true
          }
          const catBlackList = JSON.parse(levSettings.blackListCategories);
          if (catBlackList.find(data => data.categoryId === channel.parent?.id )) catString = 'blacklisted';
          if (!catString) catString = channel?.parent ? `${channel.parent.name}: ${usedCatMults}` : 'No Category';

          const chanBlackList = JSON.parse(levSettings.blackListChannels);
          chanString = (chanBlackList.find(data => data.channelId === channel.id)) ? 'blacklisted' : `${channel}: ${usedChanMults}`;

          const roleBlackList = JSON.parse(levSettings.blackListRoles);
          const userBlackListRoles = roleBlackList.filter(data => userRoles.includes(data.roleId));
          const blackListRolesString = createListFromArray(userBlackListRoles, '  - <@&${roleId}>: blacklisted', false);
          roleString = `${usedRoleMults !== 'none' ? `\n  ${usedRoleMults}` : '' } ${blackListRolesString !== 'none' ? `\n  ${blackListRolesString}` : ''}`;
          const [minXp, maxXp] = calculateMultiplierXp(xpObject);
          const multiplierString =  `- **Global:** \`${levSettings.globalMultiplier}%\`\n` +
                                    `- **Category:** ${catString}\n` + 
                                    `- **Channel:** ${chanString}\n` +
                                    `- **Roles:** ${roleString !== '' ? roleString : 'none'}\n` +
                                    `**Extra Information:**\n` +
                                    `${categoryMults.length === 1 ? `- Category ${categoryMults[0].replace ? '**Replaces**' : '**stacks on**' } Global Multiplier.\n` : ''}` +
                                    `${channelMults.length === 1 && categoryMults.length === 0 ? `- Channel ${channelMults[0].replace ? '**Replaces**' : '**stacks on**' } Global Multiplier\n` : ''}` +
                                    `${usedRoleMults !== 'none' && blackListRolesString === 'none' ? '- Role Multipliers **always stack.**' : ''}`
          switch (subCmd) {
            case 'xp':
              if (minXp === 0) {
                embed = createInfoEmbed({ int: interaction, title: 'XP Calculator!', descr: `No XP can be gained with the given **Conditions** and **Multipliers:**\n ${multiplierString}`});
               } else {
                description = `${user} can gain between **${minXp} - ${maxXp} XP** with following **Conditions** and **Multipliers:**\n ${multiplierString}`
                embed = createSuccessEmbed({ int: interaction, title: 'XP Calculator!', descr: description });
              }
              break;
            case 'messages':
              if (minXp === 0) {
                embed = createInfoEmbed({ int: interaction, title: 'Message Calculator!', descr: `Messages sent with the given **Conditions** and **Multipliers** will not give any XP at all: \n${multiplierString}`});
              } else if (startLevel > level) {
                embed = createInfoEmbed({ int: interaction, title: 'Message Calculator!', descr: `${user}'s level is already higher than **lv. ${level}**.\nMessage Calculation is not possible.`});
              } else if (startLevel === level) {
                embed = createInfoEmbed({ int: interaction, title: 'Message Calculator!', descr: `${user}'s level is already equal to **lv. ${level}**. \nMessage Calculation is not possible.`});
              } else {
                const totalXp = calculateXpByLevel((level - startLevel), xpSettings);
                const minMess = Math.ceil(totalXp / maxXp);
                const maxMess = Math.ceil(totalXp / minXp);
                description = `${user} can gain **lv. ${level}** by sending between **${minMess} - ${maxMess} messages** starting at **lv. ${startLevel}** with following **Conditions** and **Multipliers:**\n ${multiplierString}`
                embed = createSuccessEmbed({ int: interaction, title: 'Message Calculator!', descr: description});
              }
              break;
          }
          interaction.editReply({ embeds: [embed] });
          break;
          
        default: // lvsys settings
          embed = showLevelSystemSettings(interaction, levSettings, globalMult, roleMults, categoryMults, channelMults,  levelRoles, blackListRoles, blackListCategories, blackListChannels, annMess)
          interaction.editReply({ embeds: [embed] });
          break;
      }
      if (setting && subCmd !== 'settings' && subCmd !== 'show' && subCmdGroup !== 'reset') {
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
