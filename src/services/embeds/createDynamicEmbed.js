const { EmbedBuilder } = require("discord.js")
const parseEmbedPlaceholders = require("./parseEmbedPlaceholders")
const getOrConvertColor = require("../../utils/getOrConvertColor")

async function createEmbed(input, embedData) {
  let embed = new EmbedBuilder()
    .setTitle(await parseEmbedPlaceholders(embedData.title, input))
    .setDescription(await parseEmbedPlaceholders(embedData.description, input))

  if (embedData.color) embed.setColor(await getOrConvertColor(embedData.color));
  if (embedData.titleUrl) embed.setURL(embedData.titleUrl);
  if (embedData.author) {
    let authorObj = {
      name: await parseEmbedPlaceholders(embedData.author, input),
      url: embedData.authorUrl,
      iconURL: await parseEmbedPlaceholders(embedData.authorIconUrl, input)
    };
    if (!embedData.authorUrl) delete authorObj.url;
    if (!embedData.authorIconUrl || authorObj.iconURL.startsWith('{')) delete authorObj.iconURL;
    embed.setAuthor(authorObj);
  }

  const fields = JSON.parse(embedData.fields) || [];
  for (const field of fields) {
    embed.addFields({
      name: await parseEmbedPlaceholders(field.name),
      value: await parseEmbedPlaceholders(field.value),
      inline: field.inline 
    });
  }

  const image = await parseEmbedPlaceholders(embedData.imageUrl, input);
  if (embedData.imageUrl && image && !image.startsWith('{')) embed.setImage(image);
  
  const thumbnail = await parseEmbedPlaceholders(embedData.imageUrl, input);
  if (embedData.thumbnailUrl && thumbnail && !thumbnail.startsWith('{')) embed.setThumbnail(thumbnail);
  if (embedData.footer) {
    let footerObj = {
      text: await parseEmbedPlaceholders(embedData.footer, input),
      iconURL: await parseEmbedPlaceholders(embedData.footerIconUrl, input)
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