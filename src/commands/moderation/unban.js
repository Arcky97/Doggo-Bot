const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: 'unban',
  description: 'Unban a member from the Server.',
  deleted: true,
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: 'member',
      description: 'The user\'s ID to unban.',
      required: true 
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'reason',
      description: 'The reason for unbanning.'
    }
  ],
  callback: async (interaction) => {
    return;
  }
};