const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { setGuildSettings } = require("../../../database/guildSettings/setGuildSettings");
const createErrorEmbed = require("../../utils/createErrorEmbed");

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
      type: ApplicationCommandOptionType.Subcommand,
      name: 'message-logging',
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
      name: 'member-logging',
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
      name: 'voice-logging',
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
      name: 'server-logging',
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
      name: 'join-leave-logging',
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
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    const channel = interaction.options.get('channel').value;
    const guildId = interaction.guild.id;
    await interaction.deferReply()
    try {
      let response = await setGuildSettings(guildId, subCommand, channel);
      interaction.editReply(response);
    } catch (error) {
      console.error('Error setting channel:', error);
      const embed = createErrorEmbed(interaction, 'There was an error setting the channel. Please try again later.');
      interaction.editReply({embeds: [embed]});
    }
  }
}