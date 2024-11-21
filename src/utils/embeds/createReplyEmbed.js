const { EmbedBuilder } = require("discord.js");

function createReplyEmbed(interaction, color, title, description, footer = true, addCommand = true) {
  try {
    const embedTitle = addCommand ? `Command ${title}` : title;
    let embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(embedTitle)
    .setDescription(description)
    .setThumbnail("https://cdn.discordapp.com/attachments/934542823724818452/1309048224824430643/Doggo_Bot_Icon_Profile3_20241121144556.png?ex=674029a9&is=673ed829&hm=701dda210a5dbf5989ab7c7aae453e1b96ff4e120cb81276f10eabfb0e8eef0e&")
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
  createWarningEmbed: ({int, title, descr, footer}) => createReplyEmbed(int, 'Orange', `${title ? title : 'Warning'}`, descr, footer, !title),
  createErrorEmbed: (interaction, description) => createReplyEmbed(interaction, 'Red', 'Error', description)
}