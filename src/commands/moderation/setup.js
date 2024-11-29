const { ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
const { setGuildSettings, getGuildLoggingConfig, setGuildLoggingConfig } = require("../../../database/guildSettings/setGuildSettings");
const { createErrorEmbed, createSuccessEmbed } = require("../../utils/embeds/createReplyEmbed");
const createLoggingMenu = require("../../utils/menus/createLoggingMenu");
const firstLetterToUpperCase = require("../../utils/firstLetterToUpperCase");

module.exports = {
  name: 'setup',
  description: 'setup channels for chatting and logging.',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'bot-chat',
      description: 'Setup the channel for chatting with the bot.',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel for chatting with the bot.',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'logging',
      description: 'Setup several channels for logging.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'message',
          description: 'Setup the channel for Message Logging.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Message Logging.',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'member',
          description: 'Setup the channel for Member Logging.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Member Logging.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'voice',
          description: 'Setup the channel for Voice Logging.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Voice Logging.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'server',
          description: 'Setup the channel for Server Logging.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Server Logging',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'join-leave',
          description: 'Setup the channel for Join/Leave Logging',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Join/Leave Logging',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'report',
          description: 'Setup the channel for Report Logging',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Report Logging',
              required: true 
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'ignore',
          description: 'Add Channels that will have no logging of any kind.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'A channel to add to the Logging Ignore list.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'events',
          description: 'Choose which events for each Log Type to enable/disable.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'type',
              description: 'Choose the Event Type.',
              required: true,
              choices: [
                {
                  name: 'message events',
                  value: 'message'
                },
                {
                  name: 'member events',
                  value: 'member',
                },
                {
                  name: 'server events',
                  value: 'server'
                },
                {
                  name: 'voice events',
                  value: 'voice'
                },
                {
                  name: 'join leave events',
                  value: 'joinLeave'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'mute-role',
      description: 'Add the Role that will be used when muting a Member in the Server.',
      options: [
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role',
          description: 'The Mute Role.',
          required: true
        }
      ]
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subCmd = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');
    const guildId = interaction.guild.id;
    let embed, title, description, choice;
    await interaction.deferReply();
  
    try {
      switch (subCmd) {
        case 'mute-role':
          [title, description] = await setGuildSettings(guildId, subCmd, role);
          break;
        case 'events':
          choice = interaction.options.getString('type');
          break;
        default:
          [title, description] = await setGuildSettings(guildId, subCmd, channel);
          break;
      }
  
      if (subCmd === 'events') {
        await interaction.editReply({ components: createLoggingMenu(choice) });
  
        const filter = (i) =>
          (i.customId === `${firstLetterToUpperCase(choice)} Logging Menu` ||
           i.customId === 'confirm' || i.customId === 'cancel') &&
           i.user.id === interaction.user.id;
  
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 150000 });
        let selectedOptions = [];
  
        collector.on('collect', async (i) => {
          if (i.customId === `${firstLetterToUpperCase(choice)} Logging Menu`) {
            selectedOptions = i.values;
            await i.deferUpdate(); // Acknowledge menu selection
          } else if (i.customId === 'confirm') {
            if (selectedOptions.length === 0) {
              await i.reply({ content: 'Please make a selection before confirming.', ephemeral: true });
              return;
            }
            let loggingConfig = await getGuildLoggingConfig(guildId, choice);

            const filteredOptions = selectedOptions.filter(option => {
              if (option === 'all') return true;
              if (selectedOptions.includes('all')) return false;

              const [category] = option.split('.');
              return !selectedOptions.includes(`${category}.all`) || option === `${category}.all`;
            });
            Object.keys(loggingConfig).forEach(category => {
              if (typeof loggingConfig[category] === 'object') {
                Object.keys(loggingConfig[category]).forEach(subOption => {
                  loggingConfig[category][subOption] = false
                });
              } else {
                loggingConfig[category] = false;
              }
            });

            filteredOptions.forEach(option => {
              const [category, subOption] = option.includes('.') ? option.split('.') : [null, option];

              if (category) {
                if (subOption === 'all')
                  if (loggingConfig[category] && typeof loggingConfig[category] === 'object') {
                    Object.keys(loggingConfig[category]).forEach(key => {
                      loggingConfig[category][key] = true;
                    });
                  } else {
                    if (loggingConfig[category] && loggingConfig[category][subOption] !== undefined) {
                      loggingConfig[category][subOption] = true;
                    }
                  }
              } else {
                if (subOption === 'all') {
                  Object.keys(loggingConfig).forEach(key => {
                    loggingConfig[key] = true;
                  })
                } else {
                  loggingConfig[subOption] = true;
                }
              }
            })

            await setGuildLoggingConfig(guildId, choice, loggingConfig);

            await i.update({ content: 'Logging preferences updated!', components: [] });
            collector.stop();
          } else if (i.customId === 'cancel') {
            console.log('Canceled');
            await i.update({ content: 'Logging preferences were not updated.', components: [] });
            collector.stop();
          }
        });
  
        collector.on('end', async (collected, reason) => {
          if (reason === 'time') {
            await interaction.editReply({
              content: 'Time ran out! No changes were made.',
              components: []
            });
          }
        });
      } else {
        embed = createSuccessEmbed({ int: interaction, title: title, descr: description });
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error setting channel:', error);
      embed = createErrorEmbed(interaction, 'There was an error setting the channel. Please try again later.');
      interaction.editReply({ embeds: [embed] });
    }
  }
}