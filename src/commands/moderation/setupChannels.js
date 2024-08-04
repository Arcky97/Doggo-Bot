const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { setChannel } = require('./../../../database/setData.js');
const { getChannel } = require('./../../../database/selectData.js');
const { deleteChannel } = require('../../../database/deleteData.js');

module.exports = {
  name: 'setup-channels',
  description: 'Setup the channels for different logging purposes',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'botchat',
      description: 'Setup the channel for chatting with the Bot',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel for chatting with the Bot',
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'message-logging',
      description: 'Setup the channel for Message Logging',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel for Message Logging',
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'member-logging',
      description: 'Setup the channel for Member Logging',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel for Member Logging',
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'joinleave-logging',
      description: 'Setup the channel for Join-Leave Logging',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel for Join-Leave Logging',
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'voice-logging',
      description: 'Setup the channel for Voice Logging',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel for Voice Logging',
          required: true,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'server-logging',
      description: 'Setup the channel for Server Logging',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel for Server Logging',
          required: true,
        },
      ],
    },
  ],
  default_member_permissions: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.get('channel').value;
    const guildID = interaction.guild.id;

    console.log(getChannel(guildID, subcommand))
    try {
      if (await getChannel(guildID, subcommand) === channel) {
        await deleteChannel(guildID, subcommand, channel);
        await interaction.reply(`The channel for ${subcommand} has been resetted.`);
      } else {
        if (await setChannel(guildID, subcommand, channel) === "inserted") {
          await interaction.reply(`The channel for ${subcommand} has been set to <#${channel}> successfully.`);
        } else {
          await interaction.reply(`The channel for ${subcommand} has been updated to <#${channel}> succesfully.`)
        }
      }
    } catch (error) {
      console.error('Error setting channel:', error);
      await interaction.reply('There was an error setting the channel. Please try again later.');
    }
  },
};