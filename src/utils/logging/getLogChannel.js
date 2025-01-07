const { getGuildSettings } = require("../../../database/guildSettings/setGuildSettings");
const checkChannelPermissions = require("../permissions/checkChannelPermissions");

module.exports = async (guildId, log) => {
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
  
  const hasPermissions = await checkChannelPermissions(channel);

  if (hasPermissions) return channel;
}