import { setBotStats } from "../../managers/botStatsManager.js";
import { setUserCommandStats } from "../../managers/userStatsManager.js";
import { createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";

export default {
  name: 'pat',
  description: 'Give the bot a pat.',
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    const memberId = interaction.member.id;
    const cmd = { category: 'misc', command: 'pat' };

    await interaction.deferReply();

    try {
      interaction.editReply('Thank you for the pat!');

      await setBotStats(guildId, 'command', cmd);
      await setUserCommandStats(guildId, memberId, cmd);
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