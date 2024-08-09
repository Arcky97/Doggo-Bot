const { ApplicationCommandOptionType } = require('discord.js');
const { setTriggerResponses } = require('../../../database/triggerResponses/setTriggerResponses');

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
      description: 'The response phrase',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  callback: async (client, interaction) => {
    const trigger = interaction.options.getString('trigger');
    const response = interaction.options.getString('response');
    await setTriggerResponses(trigger, response);
    await interaction.reply(`sending "${trigger}" will make me reply with "${response}".`);
  }
};