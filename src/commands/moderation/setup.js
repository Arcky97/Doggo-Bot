import { ApplicationCommandOptionType } from "discord.js";
import { setGuildSettings, getGuildLoggingConfig, setGuildLoggingConfig, convertSetupCommand } from "../../managers/guildSettingsManager.js";
import { createErrorEmbed, createSuccessEmbed, createInfoEmbed, createNotDMEmbed } from "../../services/embeds/createReplyEmbed.js";
import createLoggingMenu from "../../handlers/loggingMenuHandler.js";
import firstLetterToUpperCase from "../../utils/firstLetterToUpperCase.js";
import createMissingPermissionsEmbed from "../../utils/createMissingPermissionsEmbed.js";
import { setBotStats } from "../../managers/botStatsManager.js";
import { findJsonFile } from "../../managers/jsonDataManager.js";

const loggingTypes = findJsonFile('loggingTypes.json', 'data');

export default {
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
              description: 'The channel for Server Logging.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'join-leave',
          description: 'Setup the channel for Join/Leave Logging.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Join/Leave Logging.',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'moderation',
          description: 'Setup the channel for Moderation Logging.',
          options: [
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'The channel for Moderation Logging.',
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
                },
                {
                  name: 'moderation events',
                  value: 'moderation'
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
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'join-role',
      description: 'Add the Role that will be given to new Members joining the Server.',
      options: [
        {
          type: ApplicationCommandOptionType.Role,
          name: 'role',
          description: 'The Join Role.',
          required: true 
        }
      ]
    }
  ],
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    let embed, title, description, choice;
    const subCmd = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');
    const guildId = interaction.guild.id;

    let permEmbed = await createMissingPermissionsEmbed(interaction, interaction.member, ['ManageGuild']);
    if (permEmbed) return interaction.editReply({ embeds: [permEmbed] });

    try {
      switch (subCmd) {
        case 'mute-role':
          if (role.id === interaction.guild.id) {
            embed = createInfoEmbed({ int: interaction, title: 'Mute Role not Set!', descr: `${role} cannot be set as the Mute Role! Please try again.`});
            interaction.editReply({ embeds: [embed] });
            return;
          } else {
            [title, description] = await setGuildSettings(guildId, subCmd, role);
          }
          break;
        case 'join-role':
          if (role.id === interaction.guild.id) {
            embed = createInfoEmbed({ int: interaction, title: 'Join Role not Set!', descr: `${role} cannot be set as the Join Role! Please try again.`});
            interaction.editReply({ embeds: [embed] });
            return;
          } else {
            [title, description] = await setGuildSettings(guildId, subCmd, role);
          }
          break;
        case 'events':
          choice = interaction.options.getString('type');
          break;
        default:
          const missingChanPermEmbed = await createMissingPermissionsEmbed(interaction, null, [], channel);
          if (!missingChanPermEmbed) {
            [title, description] = await setGuildSettings(guildId, subCmd, channel);
          } else {
            missingChanPermEmbed.setDescription(`Unable to set the ${subCmd === 'bot-chat' ? '**Bot Chat Channel**' : `Channel for **${convertSetupCommand(subCmd)} Logging**`} to ${channel} as following permissions are missing:`);
            return interaction.editReply({ embeds: [missingChanPermEmbed] });
          }
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
            let configLogging = await getGuildLoggingConfig(guildId, choice);
            let description = `Your Preferences for ${firstLetterToUpperCase(choice)} Events:`;
            const loggingType = loggingTypes[choice];
            const filteredOptions = selectedOptions.filter(option => {
              if (option === 'all') return true;
              if (selectedOptions.includes('all')) return false;

              const [category] = option.split('.');
              return !selectedOptions.includes(`${category}.all`) || option === `${category}.all`;
            });

            Object.keys(configLogging).forEach(category => {
              if (typeof configLogging[category] === 'object') {
                Object.keys(configLogging[category]).forEach(subOption => {
                  configLogging[category][subOption] = false
                });
              } else {
                configLogging[category] = false;
              }
            });

            filteredOptions.forEach(option => {
              const [category, subOption] = option.includes('.') ? option.split('.') : [null, option];
            
              if (category) {
                if (subOption === 'all') {
                  // If the category exists and is an object, set all sub-options to true
                  if (configLogging[category] && typeof configLogging[category] === 'object') {
                    Object.keys(configLogging[category]).forEach(key => {
                      configLogging[category][key] = true;
                    });
                  }
                } else {
                  // Set the specific sub-option to true
                  if (configLogging[category] && configLogging[category][subOption] !== undefined) {
                    configLogging[category][subOption] = true;
                  }
                }
              } else {
                if (subOption === 'all') {
                  // Set all top-level keys to true
                  Object.keys(configLogging).forEach(key => {
                    if (typeof configLogging[key] === 'object') {
                      // If the value is an object, set all its keys to true
                      Object.keys(configLogging[key]).forEach(subKey => {
                        configLogging[key][subKey] = true;
                      });
                    } else {
                      configLogging[key] = true;
                    }
                  });
                } else {
                  // Set the specific top-level key to true
                  if (configLogging[subOption] !== undefined) {
                    configLogging[subOption] = true;
                  }
                }
              }
            });
            
            let values = [];
            embed = createSuccessEmbed({ int: interaction, title: 'Logging Preferences Updated', descr: description });
            Object.keys(loggingType).forEach(category => {
              if (typeof configLogging[category] === 'object') {
                Object.entries(loggingType[category]).forEach(([subCat, option]) => {
                  if (subCat !== 'all' || (Object.keys(loggingType[category]).length === 1 && subCat === 'all')) {
                    values.push(`${option.name}: **${configLogging[category][subCat] ? 'enabled': 'disabled'}**`);
                  }
                });
                embed.addFields({ 
                  name: category, 
                  value: `- ${values.join('\n - ')}`
                });
                values = [];
              } else {
                if (category !== 'all') {
                  description += `\n - ${loggingType[category].name}: **${configLogging[category] ? 'enabled' : 'disabled'}**`;
                }
              }
            })
            embed.setDescription(description);
            await setGuildLoggingConfig(guildId, choice, configLogging);

            await i.update({ embeds: [embed], components: [] });
            collector.stop();
          } else if (i.customId === 'cancel') {
            embed = createInfoEmbed({ int: interaction, title: 'Logging Preferences not Updated', descr: `Changing Logging Preferences for ${firstLetterToUpperCase(choice)} Logging was Canceled and no changes were made.`});
            await i.update({ embeds: [embed], components: [] });
            collector.stop();
          }
        });
  
        collector.on('end', async (_, reason) => {
          if (reason === 'time') {
            embed = createInfoEmbed({ int: interaction, title: 'Logging Preferences not Updated', descr: `Time ran out and no Changes have been made for ${firstLetterToUpperCase(choice)} Logging.`});
            await interaction.editReply({
              embeds: [embed],
              components: []
            });
          }
        });
      } else {
        embed = createSuccessEmbed({ int: interaction, title: title, descr: description });
        await interaction.editReply({ embeds: [embed] });
      }
      await setBotStats(guildId, 'command', { category: 'moderation', command: 'setup' });
    } catch (error) {
      console.error('Error setting channel:', error);
      embed = createErrorEmbed({ int: interaction, descr: 'There was an error setting the channel. Please try again later.'});
      interaction.editReply({ embeds: [embed] });
    }
  }
}