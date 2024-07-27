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
  callback: async (client, interaction) => {
    const message = interaction.options.get('message').value;

    await interaction.reply(message);

  }
};