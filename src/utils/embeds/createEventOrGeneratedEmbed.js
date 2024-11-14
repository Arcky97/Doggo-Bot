const { EmbedBuilder } = require("discord.js")
const embedPlaceholders = require("../embeds/embedPlaceholders")
const getOrConvertColor = require("../getOrConvertColor")

async function createEmbed(input, embedData) {
  let embed = new EmbedBuilder()
    .setTitle(await embedPlaceholders(embedData.title, input))
    .setDescription(await embedPlaceholders(embedData.description, input))

  if (embedData.color) embed.setColor(await getOrConvertColor(embedData.color));
  if (embedData.titleUrl) embed.setURL(embedData.titleUrl);
  if (embedData.author) {
    let authorObj = {
      name: await embedPlaceholders(embedData.author, input),
      url: embedData.authorUrl,
      iconURL: await embedPlaceholders(embedData.authorIconUrl, input)
    };
    if (!embedData.authorUrl) delete authorObj.url;
    if (!embedData.authorIconUrl) delete authorObj.iconURL;
    embed.setAuthor(authorObj);
  }

  if (embedData.imageUrl) embed.setImage(await embedPlaceholders(embedData.imageUrl, input));
  if (embedData.thumbnailUrl) embed.setThumbnail(await embedPlaceholders(embedData.thumbnailUrl, input));
  if (embedData.footer) {
    let footerObj = {
      text: await embedPlaceholders(embedData.footer, input),
      iconURL: await embedPlaceholders(embedData.footerIconUrl, input)
    };
    if (!embedData.footerIconUrl) delete footerObj.iconURL;
    embed.setFooter(footerObj);
  }
  if (embedData.timeStamp) embed.setTimestamp();
  return embed;
}

module.exports = {
  createEventEmbed: (input, embedData) => createEmbed(input, embedData),
  createGeneratedEmbed: (input, embedData) => createEmbed(input, embedData)
};