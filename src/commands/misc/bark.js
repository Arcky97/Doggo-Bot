module.exports = {
  name: 'bark',
  description: 'Makes the Doggo bark.',
  callback: async (interaction) => {
    await interaction.reply(
      'Woof!'
    );
  }
}