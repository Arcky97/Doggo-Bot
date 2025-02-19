const { getAnnounceChannel, getAnnouncePing } = require("../../managers/levelSettingsManager");
const { checkChannelPermissions } = require("../../middleware/permissions/checkPermissions");
const getAnnounceEmbed = require("./getAnnounceEmbed");

module.exports = async (input, member, userInfo) => {
  const guildId = input.guild.id;
  const embed = await getAnnounceEmbed(guildId, input, userInfo);
  const channel = client.channels.cache.get(await getAnnounceChannel(guildId));
  if (!channel) return;
  const missingPerms = await checkChannelPermissions(channel);
  if (!missingPerms.hasAll) return;
  const ping = await getAnnouncePing(guildId) === 1 ? `<@${member.id}>` : '';
  await channel.send({ content: ping, embeds: [embed] });
}