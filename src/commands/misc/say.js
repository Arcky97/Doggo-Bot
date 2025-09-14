import { ApplicationCommandOptionType } from "discord.js";
import { setBotStats } from "../../managers/botStatsManager.js";
import { createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";
import { setUserCommandStats } from "../../managers/userStatsManager.js";

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
    const guildId = interaction.guild.id;
    const memberId = interaction.member.id;
    const message = interaction.options.getString('message');
    const cmd = { category: 'misc', command: 'say' };

    await interaction.deferReply();

    try {
      interaction.editReply(message);

      await setBotStats(guildId, 'command', cmd);
      await setUserCommandStats(guildId, memberId, cmd);
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