const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const { exportToJson } = require("../../../database/controlData/visualDatabase/exportToJson");
const { setLevelSettings } = require("../../../database/levelSystem/setLevelSettings");

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
          description: 'Set the XP Multiplier for 1 or more Channels.',
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
              maxValue: 10.0
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'role',
          description: 'Set the XP Multiplier for 1 or more Roles.',
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
              maxValue: 10.0
            }
          ]
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
          description: "Add a Channel to the black list that won't give XP",
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
          description: "Add a Role to the black list that won't give XP",
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
      type: ApplicationCommandOptionType.Subcommand,
      name: 'settings',
      description: 'Shows all Settings regarding the Level System.'
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    const multi = interaction.options.get('multiplier').value;
    const guildId = interaction.guild.id;
    try {
      //await insertData('LevelSettings', { guildId: guildId, levelMultiplier: multi })
      await setLevelSettings({ id: guildId, lvMult: multi, action: 'insert' });
      interaction.reply(`The Global Multiplier was set to ${multi}!`)
    } catch (error) {
      console.error('Error setting Global Multiplier:', error);
      interaction.reply('There was an error setting the Global Multiplier!');
    }
  }
}