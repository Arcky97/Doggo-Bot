const { EmbedBuilder } = require("discord.js");

function createReplyEmbed(interaction, color, title, description, footer = true, addCommand = true) {
  try {
    const embedTitle = addCommand ? `Command ${title}` : title;
    let embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(embedTitle)
    .setDescription(description)
    if (footer) {
      embed.setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL()
      })
      embed.setTimestamp()
    }
    return embed;
  } catch (error) {
    console.error(`Error creating ${title} embed`, error);
  }
}

module.exports = {
  createSuccessEmbed: ({int, title, descr, footer}) => createReplyEmbed(int, 'Green', title, descr, footer, false),
  createInfoEmbed: ({int, title, descr, footer}) => createReplyEmbed(int, 'Yellow', `${title ? title : 'Info'}`, descr, footer, !title),
  createWarningEmbed: (interaction, description) => createReplyEmbed(interaction, 'Orange', 'Warning', description),
  createErrorEmbed: (interaction, description) => createReplyEmbed(interaction, 'Red', 'Error', description)
}