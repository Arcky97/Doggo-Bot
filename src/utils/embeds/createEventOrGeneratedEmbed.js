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
    if (!embedData.authorIconUrl || authorObj.iconURL.startsWith('{')) delete authorObj.iconURL;
    embed.setAuthor(authorObj);
  }

  const image = await embedPlaceholders(embedData.imageUrl, input);
  if (embedData.imageUrl && image && !image.startsWith('{')) embed.setImage(image);
  
  const thumbnail = await embedPlaceholders(embedData.imageUrl, input);
  if (embedData.thumbnailUrl && thumbnail && !thumbnail.startsWith('{')) embed.setThumbnail(thumbnail);
  if (embedData.footer) {
    let footerObj = {
      text: await embedPlaceholders(embedData.footer, input),
      iconURL: await embedPlaceholders(embedData.footerIconUrl, input)
    };
    if (!embedData.footerIconUrl || footerObj.iconURL.startsWith('{')) delete footerObj.iconURL;
    embed.setFooter(footerObj);
  }
  if (embedData.timeStamp) embed.setTimestamp();
  return embed;
}

module.exports = {
  createEventEmbed: (input, embedData) => createEmbed(input, embedData),
  createGeneratedEmbed: (input, embedData) => createEmbed(input, embedData)
};