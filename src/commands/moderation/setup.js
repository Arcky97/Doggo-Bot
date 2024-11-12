const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { setGuildSettings } = require("../../../database/guildSettings/setGuildSettings");
const { createErrorEmbed, createSuccessEmbed } = require("../../utils/createReplyEmbed");

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
    let embed, title, description;
    await interaction.deferReply()
    try {
      if (subCmd !== 'mute-role') {
        [title, description] = await setGuildSettings(guildId, subCmd, channel);    
      } else {
        // add mute role
        [title, description] = await setGuildSettings(guildId, subCmd, role);
      }
      embed = createSuccessEmbed({int: interaction, title: title, descr: description});
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error setting channel:', error);
      embed = createErrorEmbed(interaction, 'There was an error setting the channel. Please try again later.');
      interaction.editReply({embeds: [embed]});
    }
  }
}