const { createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const setActivity = require("../../utils/setActivity")

module.exports = {
  name: 'refresh',
  description: 'Refreshes the bot',
  callback: async (client, interaction) => {
    try {
      await setActivity(client);
      const embed = createInfoEmbed({
        int: interaction,
        title: 'Doggo Bot Refreshed',
        descr: 'Doggo Bot has been refreshed!'
      })
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error Refreshing the Bot.', error);
    }
  }
}