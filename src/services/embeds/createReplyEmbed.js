const { EmbedBuilder } = require("discord.js");
const botMood = require('../../../data/images.json');

/**
 * 
 * @param {Object} interaction 
 * @param {*} color 
 * @param {String} title 
 * @param {String} description 
 * @param {String} footer 
 * @param {Boolean} addCommand 
 * @param {String} mood 
 * @returns 
 */
function createReplyEmbed(interaction, color, title, description, footer = true, addCommand = true, mood) {
  try {
    const embedTitle = addCommand ? `Command ${title}` : title;
    const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(embedTitle)
    .setDescription(description || "no description given")
    .setThumbnail(botMood[`${mood}`])
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
  createSuccessEmbed: ({int, title, descr, footer}) => createReplyEmbed(int, 'Green', title, descr, footer, false, "happy"),
  createInfoEmbed: ({int, title, descr, footer}) => createReplyEmbed(int, 'Yellow', `${title ? title : 'Info'}`, descr, footer, !title, "sad"),
  createWarningEmbed: ({int, title, descr, footer}) => createReplyEmbed(int, 'Orange', `${title ? title : 'Warning'}`, descr, footer, !title, "annoyed"),
  createErrorEmbed: ({int, title, descr, footer}) => createReplyEmbed(int, 'Red', `${title ? title: 'Error'}`, descr, footer, !title, "shocked"),
  createUnfinishedEmbed: (int) => createReplyEmbed(int, 'Blue', 'Unfinished', 'Sorry, this Command is not finished yet.', true, true, "Sleepy")
}