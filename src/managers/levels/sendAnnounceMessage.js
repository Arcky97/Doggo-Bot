import { getAnnounceChannel, getAnnouncePing } from "../../managers/levelSettingsManager.js";
import { checkChannelPermissions } from "../../middleware/permissions/checkPermissions.js";
import getAnnounceEmbed from "./getAnnounceEmbed.js";

export default async (input, member, userInfo) => {
  const guildId = input.guild.id;
  const embed = await getAnnounceEmbed(guildId, input, userInfo);
  const channel = client.channels.cache.get(await getAnnounceChannel(guildId));
  if (!channel) return;
  const missingPerms = await checkChannelPermissions(channel);
  if (!missingPerms.hasAll) return;
  const ping = await getAnnouncePing(guildId) === 1 ? `<@${member.id}>` : '';
  await channel.send({ content: ping, embeds: [embed] });
}