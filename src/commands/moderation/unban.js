const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");


module.exports = {
  name: 'unban',
  description: 'Unban a member from the Server.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'member',
      description: 'The User\'s ID to unban.',
      required: true
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'reason',
      description: 'The reason for unbanning.'
    }
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
    interaction.reply('You are unbanned...');
  }
}