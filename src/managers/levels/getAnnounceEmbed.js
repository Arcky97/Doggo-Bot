const { EmbedBuilder } = require("discord.js");
const { getAnnounceMessage } = require("../levelSettingsManager");
const parseEmbedPlaceholders = require("../../services/embeds/parseEmbedPlaceholders");

module.exports = async (guildId, user, userLevelInfo) => {
  let annMessage = await getAnnounceMessage(guildId, userLevelInfo.level);
  if (annMessage.lv) annMessage = annMessage.options; 
  const footerIcon = await parseEmbedPlaceholders(annMessage.footer.iconUrl, user, userLevelInfo);
  const thumbnail = await parseEmbedPlaceholders(annMessage.thumbnailUrl, user, userLevelInfo);
  const image = await parseEmbedPlaceholders(annMessage.imageUrl, user, userLevelInfo);
  let footerObj = {
    text: await parseEmbedPlaceholders(annMessage.footer.text, user, userLevelInfo),
    iconURL: footerIcon
  };
  if (!footerObj.iconURL || footerObj.iconURL.startsWith('{')) delete footerObj.iconURL;

  let embed = new EmbedBuilder()
    .setColor(await parseEmbedPlaceholders(annMessage.color, user, userLevelInfo))
    .setTitle(await parseEmbedPlaceholders(annMessage.title, user, userLevelInfo))
    .setDescription(await parseEmbedPlaceholders(annMessage.description, user, userLevelInfo))
    .setFooter(footerObj);
  if (annMessage.thumbnailUrl && thumbnail && !thumbnail.startsWith('{')) embed.setThumbnail(thumbnail)
  if (annMessage.imageUrl && image && !image.startsWith('{')) embed.setImage(image);
  if (annMessage.timeStamp) embed.setTimestamp();
  return embed;
}