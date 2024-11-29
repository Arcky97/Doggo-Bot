const { EmbedBuilder } = require("discord.js");
const { getAnnounceMessage } = require("../../../database/levelSystem/setLevelSettings");
const embedPlaceholders = require("../embeds/embedPlaceholders");
const getOrConvertColor = require("../getOrConvertColor");

module.exports = async (guildId, user, userLevelInfo) => {
  let annMessage = await getAnnounceMessage(guildId, userLevelInfo.level);
  if (annMessage.lv) annMessage = annMessage.options; 
  const footerIcon = await embedPlaceholders(annMessage.footer.iconUrl, user, userLevelInfo);
  const thumbnail = await embedPlaceholders(annMessage.thumbnailUrl, user, userLevelInfo);
  const image = await embedPlaceholders(annMessage.imageUrl, user, userLevelInfo);
  let footerObj = {
    text: await embedPlaceholders(annMessage.footer.text, user, userLevelInfo),
    iconURL: footerIcon
  };
  if (!footerObj.iconURL || footerObj.iconURL.startsWith('{')) delete footerObj.iconURL;

  let embed = new EmbedBuilder()
    .setColor(await embedPlaceholders(annMessage.color, user, userLevelInfo))
    .setTitle(await embedPlaceholders(annMessage.title, user, userLevelInfo))
    .setDescription(await embedPlaceholders(annMessage.description, user, userLevelInfo))
    .setFooter(footerObj);
  if (annMessage.thumbnailUrl && thumbnail && !thumbnail.startsWith('{')) embed.setThumbnail(thumbnail)
  if (annMessage.imageUrl && image && !image.startsWith('{')) embed.setImage(image);
  if (annMessage.timeStamp) embed.setTimestamp();
  return embed;
}