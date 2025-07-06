import { GuildNSFWLevel } from "discord.js";

export default (nsfwLevel) => {
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