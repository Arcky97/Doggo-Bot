const { setBotStats } = require("../../managers/botStatsManager");
const { createInfoEmbed } = require("../../services/embeds/createReplyEmbed");
const setActivity = require("../../services/botActivityService")

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