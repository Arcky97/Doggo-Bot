const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the Server!',
  options: [
    {
      name: 'targer-user',
      description: 'The user to ban.',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },
    {
      name: 'reason',
      description: 'The reason for banning.',
      type: ApplicationCommandOptionType.String 
    }
  ],
  permissionRequired: [PermissionFlagsBits.Administrator, PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.Administrator ,PermissionFlagsBits.BanMembers],
  callback: (client, interaction) => {
    interaction.channel.send('ban...');
  }

}