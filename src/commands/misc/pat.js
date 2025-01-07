module.exports = {
  name: 'pat',
  description: 'Give the bot a pat.',
  callback: async (interaction) => {
    await interaction.reply(
      'Thank you for the pat!'
    );
  }
};