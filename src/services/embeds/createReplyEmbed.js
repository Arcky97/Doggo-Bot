import { EmbedBuilder } from "discord.js";
import { findJsonFile } from '../../managers/jsonDataManager.js';

const botMood = findJsonFile('images.json', 'data');

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
        text: interaction.guild?.name || 'DM',
        iconURL: interaction.guild?.iconURL() || null
      })
      embed.setTimestamp()
    }
    return embed;
  } catch (error) {
    console.error(`Error creating ${title} embed`, error);
  }
}

export function createSuccessEmbed ({int, title, descr, footer}) {
  return createReplyEmbed(int, 'Green', title, descr, footer, false, "happy")
}

export function createInfoEmbed ({int, title, descr, footer}) {
  return createReplyEmbed(int, 'Yellow', `${title ? title : 'Info'}`, descr, footer, !title, "sad")
}

export function createWarningEmbed ({int, title, descr, footer}) {
  return createReplyEmbed(int, 'Orange', `${title ? title : 'Warning'}`, descr, footer, !title, "annoyed")
}

export function createErrorEmbed ({int, title, descr, footer}) {
  return createReplyEmbed(int, 'Red', `${title ? title: 'Error'}`, descr, footer, !title, "shocked")
}

export function createUnfinishedEmbed (int) {
  return createReplyEmbed(int, 'Blue', 'Unfinished', 'Sorry, this Command is not finished yet.', true, true, "Sleepy")
}

export function createNotDMEmbed (int) {
  return createReplyEmbed(int, 'Fuchsia', 'Not DM Command', 'This command cannot be executed in DM with the bot. Try it out in a Server instead.', true, false, "annoyed")
}