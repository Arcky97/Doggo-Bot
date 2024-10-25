const { EmbedBuilder } = require('discord.js');

module.exports = (interaction, title, description) => {
  return embed = new EmbedBuilder()
    .setColor('#20B2AA')
    .setTitle(title)
    .setDescription(description)
    .setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL()
    })
    .setTimestamp()
}