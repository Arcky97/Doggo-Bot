const { ApplicationCommandOptionType } = require("discord.js");
const formatTime = require("../../utils/formatTime");
const { createSuccessEmbed } = require("../../utils/embeds/createReplyEmbed");

module.exports = {
  name: 'userage',
  description: "Find out how old an User's Account is.",
  options: [
    {
      name: 'user',
      description: "The user to know it's account age",
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    }
  ],
  callback: async (client, interaction) => {
    const member = interaction.options.getMember('user');
    const age = await formatTime(member.user.createdAt, true);
    try {
      let embed = createSuccessEmbed({int: interaction, title: 'User Age', descr: `${member.user.username}'s account is ${age} old.`, footer: false});
      await interaction.reply({embeds: [embed]});
    } catch (error) {
      console.error('There was an error retrieving the user\'s age:', error);
    }
  }
}