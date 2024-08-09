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
    const message = await setTriggerResponses({trigger: trigger, response: response, action: "insert" });
    if (message.includes("?")) {
      const sentMessage = await interaction.reply({ content: message, fetchReply: true});

      await sentMessage.react('✅');
      await sentMessage.react('❎');

      const filter = (reaction, user) => {
        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === interaction.user.id
      };

      sentMessage.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();
          if (reaction.emoji.name === '✅') {
            interaction.followUp('The response has been successfully added to the existing trigger.');
            setTriggerResponses({trigger: trigger, response: response, action: "update"});
          } else {
            interaction.followUp('The response has been successfully added as a new trigger.');

          }
        })
        .catch(collected => {
          interaction.followUp('You did not react in time!');
        });
    } else {
      await interaction.reply(message);
    }
  }
};