const { ApplicationCommandOptionType } = require("discord.js");
const formatTime = require("../../utils/formatTime");

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
      interaction.reply(`${member.user.username}'s account is ${age} old.`)
    } catch (error) {
      console.error("There was an error retrieving the user's age:", error)
    }
  }
}