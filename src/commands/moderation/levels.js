const { PermissionFlagsBits, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { setLevelSettings, getRoleOrChannelMultipliers, getLevelSettings, getRoleOrChannelBlacklist, getLevelRoles, resetLevelSettings } = require("../../../database/levelSystem/setLevelSettings");
const { setChannelOrRoleArray, setAnnounceLevelArray, setLevelRolesArray } = require("../../utils/setArrayValues");
const createListFromArray = require("../../utils/settings/createListFromArray");
const showMultiplierSettings = require("../../utils/levels/showMultiplierSettings");
const showLevelSystemSettings = require("../../utils/levels/showLevelSystemSettings");
const getOrConvertColor = require("../../utils/getOrConvertColor");
const showAnnouncementSettings = require("../../utils/levels/showAnnouncementSettings");
const embedPlaceholders = require("../../utils/embedPlaceholders");
const showBlacklistSettings = require("../../utils/levels/showBlacklistSettings");
const showVoiceSettings = require("../../utils/levels/showVoiceSettings");
const { resetLevelSystem } = require("../../../database/levelSystem/setLevelSystem");
const { createErrorEmbed, createSuccessEmbed, createWarningEmbed, createInfoEmbed } = require("../../utils/createReplyEmbed");
const calculateXpByLevel = require("../../utils/levels/calculateXpByLevel");

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
        globalMult = levSettings.globalMultiplier
        roleMults = createListFromArray(levSettings.roleMultipliers, '- `${value}%` - <@&${roleId}>');
        channelMults = createListFromArray(levSettings.channelMultipliers, '- `${value}%` - <#${channelId}>'); 
        levelRoles = createListFromArray(levSettings.levelRoles, 'lv. ${level} - <@&${roleId}>');
        annMess = JSON.parse(levSettings.announceLevelMessages);
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
      let data, setting, existingSetting, action, setData, role, channel, level;

      switch(subCmdGroup) {
        case 'multiplier':
          value = Math.round(value * 100);
          if (subCmd !== 'global' && subCmd !== 'settings') {
            data = await getRoleOrChannelMultipliers({ id: guildId, type: subCmd }) || [];
          }
          switch(subCmd) {
            case 'global':
              setting = { 'globalMultiplier': value };
              embed = createSuccessEmbed({int: interaction, title: 'Global Multiplier Set!', descr: `The Global Multiplier has been set to \`${value}%\`!`});
              interaction.editReply({embeds: [embed]});
              break;
            case 'channel':
              channel = interaction.options.getChannel('name');
              [action, setData] = setChannelOrRoleArray('channel', data, channel.id, value);
              setting = { 'channelMultipliers': setData };
              embed = createSuccessEmbed({int: interaction, title: `Channel Multiplier ${action}!`, descr: `The ${subCmd} ${subCmdGroup} for ${channel} has been ${action !== 'removed' ? `set to \`${value}%\`` : action}!`});
              interaction.editReply({embeds: [embed]});
              break
            case 'role':
              role = interaction.options.getRole('name');
              if (role.id !== guildId) {
                [action, setData] = setChannelOrRoleArray('role', data, role.id, value);
                setting = { 'roleMultipliers': setData };
                embed = createSuccessEmbed({int: interaction, title: `Role Multiplier ${action}!`, descr: `The ${subCmd} ${subCmdGroup} for ${role} has been ${action !== 'removed' ? `set to \`${value}%\`` : action }!`});
              } else {
                embed = createWarningEmbed(interaction, `A Role Multiplier can't be set for ${role}.`);
              }
              interaction.editReply({embeds: [embed]});
              break;
            case 'settings':
              embed = showMultiplierSettings(levSettings, globalMult, roleMults, channelMults);
              await interaction.editReply({ embeds: [embed] });
              break;
          }
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
              embedOptions = {
                title: interaction.options.getString('title') || '{user global} has leveled up!',
                description: interaction.options.getString('description') || '{Congrats you leveled up to lv. {level}!',
                color: interaction.options.getString('color') || await getOrConvertColor('green'),
                thumbnailUrl: interaction.options.getBoolean('thumbnailurl') ? '{user avatar}' : null,
                imageUrl: interaction.options.getString('imageurl') || null,
                footer: {
                  text: interaction.options.getString('footer') || '{server name}',
                  iconUrl: interaction.options.getString('footericonurl') || '{server icon}'
                },
                timeStamp: interaction.options.getBoolean('timestamp') || true 
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
              if (embedOptions) {
                embed = new EmbedBuilder()
                  .setColor(await embedPlaceholders(embedOptions.color, interaction))
                  .setTitle(await embedPlaceholders(embedOptions.title, interaction))
                  .setDescription(await embedPlaceholders(embedOptions.description, interaction))
                  .setFooter({
                    text: await embedPlaceholders(embedOptions.footer.text, interaction),
                    iconUrl: await embedPlaceholders(embedOptions.footer.iconUrl, interaction)
                  })
                if (embedOptions.imageUrl) embed.setImage(await embedPlaceholders(embedOptions.imageUrl, interaction))
                if (embedOptions.thumbnailUrl) embed.setThumbnail(await embedPlaceholders(embedOptions.thumbnailUrl, interaction));
                if (embedOptions.timeStamp) embed.setTimestamp();
              } else {
                embed = createInfoEmbed({int: interaction, title: 'Level Up Message not found!', descr: `No Level Up Message set for lv. ${level}!`});
              }
              break;
            case 'placeholders':
              const fieldObject = {
                "user": [
                  '**{user id}** (The user\'s ID)', 
                  '**{user mention}** (Mention the User)', 
                  '**{user name}** (The user\'s name)', 
                  '**{user global}** (The user\'s Global name)', 
                  '**{user nick}** (The User\'s nickname)', 
                  '**{user avatar}** (The user\'s Avatar Url)', 
                  '**{user color}** (The user\'s Rank Card Color)'
                ],
                "level and xp": [
                  '**{user xp}** (The user\'s current level XP)', 
                  '**{level}** (The user\'s current level)', 
                  '**{level previous}** (The user\'s previous level)', 
                  '**{level previous xp}** (The user\'s previous level XP)', 
                  '**{level next}** (The user\'s next level)', 
                  '**{level next xp}** (The user\'s next level XP)'
                ],
                "level awards": [
                  '**{reward}** (The Reward Role)', 
                  '**{reward role name}** (The Reward Role\'s name)', 
                  '**{reward rolecount}** (The total Reward Count)', 
                  '**{reward rolecount progress}** (The Reward progress in **{reward rolecount progress}** format)', '**{reward previous}** (The previous Reward Role)', 
                  '**{reward next}** (The next Reward Role)'
                ],
                "server": [
                  '**{server id}** (The Server\'s ID)', 
                  '**{server name}** (The Server\'s name)', 
                  '**{server member count}** (The total Members in the Server)', 
                  '**{server icon}** (The Server Icon Url)'
                ],
                "other" : [
                  '{new line} (Add a new line)'
                ]
              }
              embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Announce Level Up Message Placeholders')
                .setTimestamp()
              for (const [key, placeholders] of Object.entries(fieldObject)) {
                const values = await Promise.all(
                  placeholders.map(async (placeholder) => `\`${placeholder.split('}')[0] + '}'}\` = ${await embedPlaceholders(placeholder, interaction)}`)
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
              channel = interaction.options.getChannel('name');
              [action, setData] = setChannelOrRoleArray('channel', data, channel.id);
              setting = { 'blackListChannels' : setData };
              embed = createSuccessEmbed({int: interaction, title: `Channel ${action}!`, descr: `${channel} has been ${action} to the Black List.`});
              break;
            case 'role':
              role = interaction.options.getRole('name');
              [action, setData] = setChannelOrRoleArray('role', data, role.id);
              setting = { 'blackListRoles' : setData};
              embed = createSuccessEmbed({int: interaction, title: `Role ${action}!`, descr: `${role} has been ${action} to the Black List.`});
              break;
            case 'settings':
              embed = showBlacklistSettings(blackListRoles, blackListChannels);
              break;
          }
          await interaction.editReply({ embeds: [embed] });
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
              setting = {'voiceEnable': value };
              interaction.editReply(`Voice XP has been ${value ? 'Enabled' : 'Disabled'}!`);
              break;
            case 'multiplier':
              value = Math.round(value * 100);
              setting = {'voiceMultiplier': value};
              interaction.editReply(`Voice Multiplier has been set to ${value}%`);
              break;
            case 'cooldown':
              setting = {'voiceCooldown': value};
              interaction.editReply(`Voice cooldown has been set to ${value} ${value > 1 ? 'seconds' : 'second'}!`);
              break;
            case 'settings':
              embed = showVoiceSettings(levSettings);
              interaction.editReply({ embeds: [embed]})
              break;
          }
          break;
        case 'reset':
          switch(subCmd) {
            case 'settings':
              await resetLevelSettings(guildId);
              interaction.editReply('The Level System Settings have been resetted.');
              break;
            case 'levels':
              const user = interaction.options.getMentionable('user');
              await resetLevelSystem(guildId, user);
              interaction.editReply(`${user ? `The Level for ${user} has`: 'All Levels have'} been resetted.`);
              break;
          }
          break;
        default:
          if (subCmd === 'cooldown') {
            setting = { 'xpCooldown' : value };
            await interaction.editReply(`The XP cool down has been set to ${value} ${value > 1 ? 'seconds' : 'second'}!`);
          } else { // subCmd === 'settings'
            embed = showLevelSystemSettings(interaction, levSettings, globalMult, roleMults, channelMults, levelRoles, blackListRoles, blackListChannels, annMess)
            interaction.editReply({ embeds: [embed] });
          }
          break;
      }
      if (subCmd !== 'settings' && subCmd !== 'show' && subCmdGroup !== 'reset') {
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