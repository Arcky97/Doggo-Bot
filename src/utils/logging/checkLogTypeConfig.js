const { getGuildLoggingConfig } = require("../../../database/guildSettings/setGuildSettings")

module.exports = async ({guildId, type, cat, option}) => {
  const loggingConfig = await getGuildLoggingConfig(guildId, type);
  if (cat) {
    return loggingConfig[cat][option];
  } else {
    return loggingConfig[option];
  }
}