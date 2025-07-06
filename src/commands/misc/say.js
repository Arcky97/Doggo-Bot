import { ApplicationCommandOptionType } from "discord.js";
import { setBotStats } from "../../managers/botStatsManager.js";
import { createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";

export default {
  name: 'say',
  description: 'Repeats your message.',
  options: [
    {
      name: 'message',
      description: 'Your message:',
      required: true,
      type: ApplicationCommandOptionType.String
    }
  ],
  callback: async (interaction) => {
    const message = interaction.options.getString('message');

    await interaction.deferReply();

    try {
      interaction.editReply(message);

      await setBotStats(interaction.guild?.id, 'command', { category: 'misc', command: 'say' });
    } catch (error) {
      console.error('Error with the Say Command:', error);

      const embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Say Command. Please try again later.'
      });

      interaction.editReply({ embeds: [embed] });
    }
  }
};