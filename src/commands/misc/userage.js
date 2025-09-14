import { ApplicationCommandOptionType } from "discord.js";
import formatTime from "../../utils/formatTime.js";
import { createSuccessEmbed, createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";
import { setBotStats } from "../../managers/botStatsManager.js";
import { setUserCommandStats } from "../../managers/userStatsManager.js";

export default {
  name: 'userage',
  description: "Find out how old an User's Account is.",
  options: [
    {
      name: 'user',
      description: "The user to know it's account age",
      required: true,
      type: ApplicationCommandOptionType.User
    }
  ],
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    const memberId = interaction.member.id;
    const cmd = { category: 'misc', command: 'userage' };
    console.log([interaction.user.id, interaction.member.id]);
    const member = interaction.options.getUser('user');
    
    let embed;

    await interaction.deferReply();
    
    try {
      const age = await formatTime(member.createdAt, true);
      embed = createSuccessEmbed({
        int: interaction, 
        title: 'User Age', 
        descr: `${member.username}'s account is ${age} old.`, 
        footer: false
      });

      await setBotStats(guildId, 'command', cmd);
      await setUserCommandStats(guildId, memberId, cmd);
    } catch (error) {
      console.error('Error with the Userage Command:', error);

      embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Userage Command. Please try again later.'
      });
    }
    interaction.editReply({embeds: [embed]});
  }
}