const { EmbedBuilder } = require("discord.js");
const { getAnnounceMessage } = require("../../../database/levelSystem/setLevelSettings");
const embedPlaceholders = require("../embeds/embedPlaceholders");
const getOrConvertColor = require("../getOrConvertColor");

module.exports = async (guildId, user, userLevelInfo) => {
  let annMessage = await getAnnounceMessage(guildId, userLevelInfo.level);
  if (annMessage.lv) annMessage = annMessage.options;
  const footerUrl = annMessage.length > 0 ? await embedPlaceholders(annMessage.footer.iconUrl, user, userLevelInfo) : null; 
  let embed = new EmbedBuilder()
    .setColor(await embedPlaceholders(annMessage.color, user, userLevelInfo))
    .setTitle(await embedPlaceholders(annMessage.title, user, userLevelInfo))
    .setDescription(await embedPlaceholders(annMessage.description, user, userLevelInfo))
    .setFooter(
      {
        text: await embedPlaceholders(annMessage.footer.text, user, userLevelInfo),
        iconURL: footerUrl !== '{server icon}' ? footerUrl : null
      }
    );
  if (annMessage.thumbnailUrl) embed.setThumbnail(await embedPlaceholders(annMessage.thumbnailUrl, user, userLevelInfo))
  if (annMessage.imageUrl) embed.setImage(await embedPlaceholders(annMessage.imageUrl, user, userLevelInfo));
  if (annMessage.timeStamp) embed.setTimestamp();
  return embed;
}