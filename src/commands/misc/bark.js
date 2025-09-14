import { setBotStats } from "../../managers/botStatsManager.js";
import { setUserCommandStats } from "../../managers/userStatsManager.js";
import { createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";

export default {
  name: 'bark',
  description: 'Makes the Doggo bark.',
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    const memberId = interaction.member.id;
    const cmd = { category: 'misc', command: 'bark' };

    await interaction.deferReply();

    try {
      interaction.editReply('Woof!');

      await setBotStats(guildId, 'command', cmd);
      await setUserCommandStats(guildId, memberId, cmd)
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