const { GuildNSFWLevel } = require("discord.js");

module.exports = (nsfwLevel) => {
  switch (nsfwLevel) {
    case GuildNSFWLevel.AgeRestricted:
      return 'Age Restricted';
    case GuildNSFWLevel.Default:
      return 'Default';
    case GuildNSFWLevel.Explicit:
      return 'Explicit';
    case GuildNSFWLevel.Safe:
      return 'Safe';
    default:
      return 'Unknown NSFW Level';
  }
}