const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { setBotReplies } = require("../../../database/botReplies/setBotReplies");

module.exports = {
  name: 'checkreply',
  description: 'Check for existing similar triggers.',
  devOnly: true,
  options: [
    {
      name: 'trigger',
      description: 'The trigger phrase to check.',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  callback: async (client, interaction) => {
    const trigger = interaction.options.getString('trigger');
    const message = await setBotReplies({trigger: trigger, action: 'check'});
    const matches = message.matches.map(match => `- ${match}`).join('\n');
    const embed = new EmbedBuilder()
      .setColor(message.color)
      .setTitle('Found Matches')
      .setDescription(`for "${trigger}": \n ${matches}`)
      .setTimestamp()
    await interaction.reply({ embeds: [embed] });
  }
}