const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the Server!',
  options: [
    {
      name: 'member',
      description: 'The user to ban.',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },
    {
      name: 'reason',
      description: 'The reason for banning.',
      type: ApplicationCommandOptionType.String
    },
  ],
  permissionsRequired: [
    PermissionFlagsBits.Administrator, 
    PermissionFlagsBits.BanMembers
  ], 
  botPermissions: [
    PermissionFlagsBits.Administrator, 
    PermissionFlagsBits.BanMembers
  ], 
  callback: async (client, interaction) => {
    const member = interaction.options.getMember('member')
    interaction.reply('You are banned...');
  }
};
