import { ChannelType } from "discord.js";

export default (channel) => {
  switch (channel.type) {
    case ChannelType.GuildText:
      return 'Text Channel';
    case ChannelType.DM:
      return 'Direct Message';
    case ChannelType.GuildVoice:
      return 'Voice Channel';
    case ChannelType.GroupDM:
      return 'Group Direct Message';
    case ChannelType.GuildCategory:
      return 'Category';
    case ChannelType.GuildAnnouncement:
      return 'Announcement Channel';
    case ChannelType.AnnouncementThread:
      return 'Announcement Thread Channel';
    case ChannelType.PublicThread:
      return 'Public Thread Channel';
    case ChannelType.PrivateThread:
      return 'Private Thread Channel';
    case ChannelType.GuildStageVoice:
      return 'Stage Channel';
    case ChannelType.GuildDirectory:
      return 'Server Directory Channel';
    case ChannelType.GuildForum:
      return 'Forum Channel';
    case ChannelType.GuildMedia:
      return 'Server Media Channel'
    default:
      return 'Unknown Channel Type';
  }
};