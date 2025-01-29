const { ApplicationCommandOptionType } = require("discord.js");
const formatTime = require("../../utils/formatTime");
const { createSuccessEmbed, createErrorEmbed, createInfoEmbed } = require("../../utils/embeds/createReplyEmbed");
const { setBotStats } = require("../../../database/BotStats/setBotStats");

module.exports = {
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

      await setBotStats(interaction.guild.id, 'command', { category: 'misc', command: 'userage' });
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