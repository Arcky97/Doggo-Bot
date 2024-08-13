const { ApplicationCommandOptionType } = require('discord.js');
const { setBotReplies } = require('../../../database/botReplies/setBotReplies');

module.exports = {
  name: 'addreply',
  description: 'Add a new reply.',
  devOnly: true,
  options: [
    {
      name: 'trigger',
      description: 'The trigger phrase',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'response',
      description: 'The response phrase, you can add more than 1 at once by separating them with ";"',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  callback: async (client, interaction) => {
    const trigger = interaction.options.getString('trigger');
    let response = interaction.options.getString('response');
    if (response.includes(';')) {
      response = response.split(';').map(s => s.trim()).filter(Boolean);
    } else {
      response = [response.trim()];
    }
    const message = await setBotReplies({trigger: trigger, response: response, action: "insert" });
    await interaction.reply(message);
  }
};