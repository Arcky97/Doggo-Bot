const { setBotStats } = require("../../../database/BotStats/setBotStats");
const { createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const setActivity = require("../../utils/setActivity")

module.exports = {
  name: 'refresh',
  description: 'Refreshes the bot',
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    try {
      await setActivity();
      const embed = createInfoEmbed({
        int: interaction,
        title: 'Doggo Bot Refreshed',
        descr: 'Doggo Bot has been refreshed!'
      })
      await interaction.reply({ embeds: [embed] });
      await setBotStats(guildId, 'command', { category: 'developing', command: 'refresh' });
    } catch (error) {
      console.error('Error Refreshing the Bot.', error);
    }
  }
}