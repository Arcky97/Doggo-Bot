const { getGuildLoggingConfig } = require("../../managers/guildSettingsManager.js")

module.exports = async ({guildId, type, cat, option}) => {
  const configLogging = await getGuildLoggingConfig(guildId, type);
  if (cat) {
    return configLogging[cat][option];
  } else {
    return configLogging[option];
  }
}