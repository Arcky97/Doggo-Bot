const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: 'ban',
  description: 'Ban a member from the Server.',
  deleted: true,
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: 'member',
      description: 'The user to ban.',
      required: true 
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'reason',
      description: 'The reason for banning.'
    }
  ],
  callback: async (interaction) => {
    return;
  }
};