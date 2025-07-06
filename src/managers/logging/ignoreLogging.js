import { getIgnoreLoggingChannels } from "../../managers/guildSettingsManager.js";

export default async (guildId, channelId) => {
  const ignoreChannel = await getIgnoreLoggingChannels(guildId);
  return ignoreChannel.some(data => data.channelId === channelId);
}