const { ChannelType } = require("discord.js");

module.exports = (channel) => {
  switch (channel.type) {
    case ChannelType.GuildText:
      return 'Text Channel';
    case ChannelType.GuildVoice:
      return 'Voice Channel';
    case ChannelType.GuildCategory:
      return 'Category';
    case ChannelType.GuildAnnouncement:
      return 'Announcement Channel';
    case ChannelType.PublicThread:
      return 'Public Thread Channel';
    case ChannelType.PrivateThread:
      return 'Private Thread Channel';
    case ChannelType.AnnouncementThread:
      return 'Announcement Thread Channel';
    case ChannelType.GuildStageVoice:
      return 'Stage Channel';
    case ChannelType.GuildForum:
      return 'Forum Channel';
    default:
      return 'Unknown Channel Type';
  }
};