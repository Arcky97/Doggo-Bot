const { EmbedBuilder } = require("discord.js");
const { getAnnounceMessage } = require("../../../database/levelSystem/setLevelSettings");
const embedPlaceholders = require("../embedPlaceholders");

module.exports = async (message, userLevelInfo) => {
  let annMessage = await getAnnounceMessage(message.guild.id, userLevelInfo.level);
  if (annMessage.lv !== undefined) annMessage = annMessage.options;
  const user = message;
  const footerUrl = await embedPlaceholders(annMessage.footer.iconUrl, user, userLevelInfo)
  let embed = new EmbedBuilder()
    .setColor(await embedPlaceholders(annMessage.color, user, userLevelInfo))
    .setTitle(await embedPlaceholders(annMessage.title, user, userLevelInfo))
    .setDescription(await embedPlaceholders(annMessage.description, user, userLevelInfo))
    .setFooter(
      {
        text: await embedPlaceholders(annMessage.footer.text, user, userLevelInfo),
        iconURL: footerUrl !== '{server icon}' ? footerUrl : null
      }
    )
  if (annMessage.timeStamp) embed.setTimestamp();
  if (annMessage.thumbnailUrl) embed.setThumbnail(await embedPlaceholders(annMessage.thumbnailUrl, user, userLevelInfo))
  if (annMessage.imageUrl) embed.setImage(await embedPlaceholders(annMessage.imageUrl, user, userLevelInfo))
  return embed;
}