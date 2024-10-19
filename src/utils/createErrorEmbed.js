const { EmbedBuilder } = require("discord.js")

module.exports = (interaction, description) => {
  return embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Error!')
    .setDescription(description)
    .setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL()
    })
    .setTimestamp()
}