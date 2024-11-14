const { getIgnoreLoggingChannels } = require("../../../database/guildSettings/setGuildSettings")

module.exports = async (guildId, channelId) => {
  const ignoreChannel = await getIgnoreLoggingChannels(guildId);
  return ignoreChannel.some(data => data.channelId === channelId);
}