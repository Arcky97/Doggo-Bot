import { setBotStats } from "../../managers/botStatsManager.js";
import { createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";

export default {
  name: 'pat',
  description: 'Give the bot a pat.',
  callback: async (interaction) => {
    await interaction.deferReply();

    try {
      interaction.editReply('Thank you for the pat!');

      await setBotStats(interaction.guild?.id, 'command', { category: 'misc', command: 'pat' });
    } catch (error) {
      console.error('Error with the Pat Command:', error);

      const embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Pat Command. Please try again later.'
      });
      
      interaction.editReply({ embeds: [embed] });
    }
  }
};