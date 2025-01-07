const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: 'say',
  description: 'Repeats your message.',
  options: [
    {
      name: 'message',
      description: 'Your message:',
      required: true,
      type: ApplicationCommandOptionType.String
    }
  ],
  callback: async (interaction) => {
    const message = interaction.options.getString('message');
    await interaction.reply(message);
  }
};