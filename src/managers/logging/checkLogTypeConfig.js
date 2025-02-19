const { getGuildLoggingConfig } = require("../../managers/guildSettingsManager.js")

module.exports = async ({guildId, type, cat, option}) => {
  const loggingConfig = await getGuildLoggingConfig(guildId, type);
  if (cat) {
    return loggingConfig[cat][option];
  } else {
    return loggingConfig[option];
  }
}