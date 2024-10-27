const { EmbedBuilder } = require("discord.js");
const { getAnnounceMessage } = require("../../../database/levelSystem/setLevelSettings");
const embedPlaceholders = require("../embedPlaceholders");

module.exports = async (message, userLevelInfo) => {
  let annMessage = await getAnnounceMessage(message.guild.id, userLevelInfo.level) || [];
  if (annMessage.length > 0 && !annMessage.lv) annMessage = annMessage.options;
  const user = message;
  const footerUrl = annMessage.length > 0 ? await embedPlaceholders(annMessage.footer.iconUrl, user, userLevelInfo) : null; 
  let embed = new EmbedBuilder()
  if (annMessage.color) {
    embed.setColor(await embedPlaceholders(annMessage.color, user, userLevelInfo));
  } else {
    embed.setColor('#f97316');
  }
  if (annMessage.title) {
    embed.setTitle(await embedPlaceholders(annMessage.title, user, userLevelInfo));
  } else {
    embed.setTitle(await embedPlaceholders('{user global} leveled up!', user, userLevelInfo));
  }
  if (annMessage.description) {
    embed.setDescription(await embedPlaceholders(annMessage.description, user, userLevelInfo));
  } else {
    embed.setDescription(await embedPlaceholders('Congrats, you leveled up to lv. {level}!', user, userLevelInfo));
  }
  if (annMessage.setFooter) {
    embed.setFooter(
      {
        text: await embedPlaceholders(annMessage.footer.text, user, userLevelInfo),
        iconURL: footerUrl !== '{server icon}' ? footerUrl : null
      }
    )
  } else {
    embed.setFooter(
      {
        text: await embedPlaceholders('{server name}', user, userLevelInfo),
        iconUrl: await embedPlaceholders('{server icon}', user, userLevelInfo)
      }
    )
  } 
  if (annMessage.timeStamp) embed.setTimestamp();
  if (annMessage.thumbnailUrl) {
    embed.setThumbnail(await embedPlaceholders(annMessage.thumbnailUrl, user, userLevelInfo))
  } else {
    embed.setThumbnail(await embedPlaceholders('{user avatar}', user, userLevelInfo));
  }
  if (annMessage.imageUrl) embed.setImage(await embedPlaceholders(annMessage.imageUrl, user, userLevelInfo));
  return embed;
}