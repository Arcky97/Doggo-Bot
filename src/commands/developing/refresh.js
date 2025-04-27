const { setBotStats } = require("../../managers/botStatsManager");
const { createInfoEmbed, createNotDMEmbed } = require("../../services/embeds/createReplyEmbed");
const setActivity = require("../../services/botActivityService")

module.exports = {
  name: 'refresh',
  description: 'Refreshes the bot',
  devOnly: true,
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    const guildId = interaction.guild.id;
    try {
      await setActivity('Bot Status Refreshed');
      const embed = createInfoEmbed({
        int: interaction,
        title: 'Doggo Bot Refreshed',
        descr: 'Doggo Bot has been refreshed!'
      })
      interaction.editReply({ embeds: [embed] });
      await setBotStats(guildId, 'command', { category: 'developing', command: 'refresh' });
    } catch (error) {
      console.error('Error Refreshing the Bot.', error);
    }
  }
}