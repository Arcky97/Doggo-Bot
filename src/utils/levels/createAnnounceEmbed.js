const { EmbedBuilder } = require("discord.js");
const { getAnnounceMessage } = require("../../../database/levelSystem/setLevelSettings");
const embedPlaceholders = require("../embedPlaceholders");

module.exports = async (message, userLevelInfo) => {
  const annMessage = await getAnnounceMessage(message.guild.id, userLevelInfo.level);
  const user = message;
  //console.log(await embedPlaceholders(annMessage.footer.text, user, userLevelInfo))
  let embed = new EmbedBuilder()
    .setColor(await embedPlaceholders(annMessage.color, user, userLevelInfo))
    .setTitle(await embedPlaceholders(annMessage.title, user, userLevelInfo))
    .setDescription(await embedPlaceholders(annMessage.title, user, userLevelInfo))
    //.setFooter(
    //  {
    //    name: await embedPlaceholders(annMessage.footer.text, user, userLevelInfo),
    //    iconURL: await embedPlaceholders(annMessage.footer.iconUrl, user, userLevelInfo)
    //  }
    //)
  if (annMessage.timeStamp) embed.setTimestamp();
  if (annMessage.thumbnailUrl) embed.setThumbnail(await embedPlaceholders(annMessage.thumbnailUrl, user, userLevelInfo))
  if (annMessage.imageUrl) embed.setImage(await embedPlaceholders(annMessage.imageUrl, user, userLevelInfo))
  return embed;
}