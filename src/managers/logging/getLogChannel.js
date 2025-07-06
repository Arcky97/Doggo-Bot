import { getGuildSettings } from "../../managers/guildSettingsManager.js";
import { checkChannelPermissions } from "../../middleware/permissions/checkPermissions.js";

export default async (guildId, log, returnMissing = false) => {
  const logChannels = await getGuildSettings(guildId);
  if (!logChannels) return;

  let channel;
  switch(log) {
    case 'member':
      channel = client.channels.cache.get(logChannels.memberLogging);
      break;
    case 'message':
      channel = client.channels.cache.get(logChannels.messageLogging);
      break;
    case 'joinleave':
      channel = client.channels.cache.get(logChannels.joinLeaveLogging);
      break;
    case 'server':
      channel = client.channels.cache.get(logChannels.serverLogging);
      break;
    case 'voice':
      channel = client.channels.cache.get(logChannels.voiceLogging);
      break;
    case 'moderation':
      channel = client.channels.cache.get(logChannels.moderationLogging);
      break;
  }

  if (!channel) return;
  const perms = await checkChannelPermissions(channel, ['EmbedLinks']);
  if (!perms.hasAll && returnMissing) {
    // missing permissions
    return { ...channel, ...perms };
  } else {
    return channel;
  }
}