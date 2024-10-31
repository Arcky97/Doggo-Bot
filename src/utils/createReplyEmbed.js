const { EmbedBuilder } = require("discord.js");

function createReplyEmbed(interaction, color, title, description, addCommand = true) {
  try {
    const embedTitle = addCommand ? `Command ${title}` : title;
    return embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(embedTitle)
    .setDescription(description)
    .setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL()
    })
    .setTimestamp()
  } catch (error) {
    console.error(`Error creating ${title} embed`, error);
  }
}

module.exports = {
  createSuccessEmbed: (interaction, title, description) => createReplyEmbed(interaction, 'Green', title, description, false),
  createInfoEmbed: (interaction, description) => createReplyEmbed(interaction, 'Yellow', 'Info', description),
  createWarningEmbed: (interaction, description) => createReplyEmbed(interaction, 'Orange', 'Warning', description),
  createErrorEmbed: (interaction, description) => createReplyEmbed(interaction, 'Red', 'Error', description)
}