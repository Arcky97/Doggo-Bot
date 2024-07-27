module.exports = {
  name: 'bark',
  description: 'Makes the Doggo bark.',
  callback: async (client, interaction) => {
    await interaction.reply(
      'Woof!'
    );
  }
}