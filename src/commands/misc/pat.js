module.exports = {
  name: 'pat',
  description: 'Give the bot a pat.',
  callback: async (client, interaction) => {
    await interaction.reply(
      'Thank you for the pat!'
    );
  }
};