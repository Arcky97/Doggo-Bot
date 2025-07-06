import { setBotStats } from "../../managers/botStatsManager.js";
import { createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";

export default {
  name: 'bark',
  description: 'Makes the Doggo bark.',
  callback: async (interaction) => {
    await interaction.deferReply();

    try {
      interaction.editReply('Woof!');

      await setBotStats(interaction.guild?.id, 'command', { category: 'misc', command: 'bark' });
    } catch (error) {
      console.error('Error with the Bark Command:', error);

      const embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Bark Command. Please try again later.'
      });
      interaction.editReply({ embeds: [embed]});
    }
  }
}