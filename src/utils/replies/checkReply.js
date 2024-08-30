const { EmbedBuilder } = require("discord.js");
const { setBotReplies } = require("../../../database/botReplies/setBotReplies");

const checkReply = async (interaction) => {
  const trigger = interaction.options.getString('trigger');
  const message = await setBotReplies({trigger: trigger, action: 'check'});
  const matches = message.matches.map(match => `- ${match}`).join('\n');
  const embed = new EmbedBuilder()
    .setColor(message.color)
    .setTitle('Found Matches')
    .setDescription(`for "${trigger}": \n ${matches}`)
    .setTimestamp()
  await interaction.reply({ embeds: [embed] });
};

module.exports = { checkReply };