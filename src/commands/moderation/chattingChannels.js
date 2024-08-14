const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { setGuildSettings } = require('../../../database/guildSettings/setGuildSettings.js');

module.exports = {
  name: 'setup-chat',
  description: 'Setup the channel for chatting with the Bot.',
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'The channel for chatting with the Bot.',
      required: true
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const channel = interaction.options.get('channel').value;
    const guildID = interaction.guild.id; 
    const response = await setGuildSettings(guildID, 'chattingChannel', channel)
    await interaction.reply(response);
  }
};