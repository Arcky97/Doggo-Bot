const { getIgnoreLoggingChannels } = require("../../managers/guildSettingsManager.js")

module.exports = async (guildId, channelId) => {
  const ignoreChannel = await getIgnoreLoggingChannels(guildId);
  return ignoreChannel.some(data => data.channelId === channelId);
}