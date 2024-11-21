const { getAnnounceChannel, getAnnouncePing } = require("../../../database/levelSystem/setLevelSettings");
const createAnnounceEmbed = require("./createAnnounceEmbed");

module.exports = async (client, input, member, userInfo) => {
  const guildId = input.guild.id;
  const embed = await createAnnounceEmbed(guildId, input, userInfo);
  const channel = client.channels.cache.get(await getAnnounceChannel(guildId));
  if (!channel) return;
  const ping = await getAnnouncePing(guildId) === 1 ? `<@${member.id}>` : '';
  await channel.send({ content: ping, embeds: [embed] });
}