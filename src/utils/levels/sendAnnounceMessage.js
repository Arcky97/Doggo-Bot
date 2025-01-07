const { getAnnounceChannel, getAnnouncePing } = require("../../../database/levelSystem/setLevelSettings");
const checkClientPermissions = require("../checkClientPermissions");
const { createWarningEmbed } = require("../embeds/createReplyEmbed");
const createAnnounceEmbed = require("./createAnnounceEmbed");

module.exports = async (input, member, userInfo) => {
  const guildId = input.guild.id;
  const embed = await createAnnounceEmbed(guildId, input, userInfo);
  const channel = client.channels.cache.get(await getAnnounceChannel(guildId));
  if (!channel) return;
  const missingPerms = checkClientPermissions(channel, ['SendMessages', 'EmbedLinks']);
  if (!missingPerms || missingPerms.length > 0) return;
  const ping = await getAnnouncePing(guildId) === 1 ? `<@${member.id}>` : '';
  await channel.send({ content: ping, embeds: [embed] });
}