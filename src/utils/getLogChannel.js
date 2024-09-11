const { selectData } = require("../../database/controlData/selectData");

module.exports = async (client, guild, log) => {
  const logChannels = await selectData('GuildSettings', { guildId: guild });

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
  }
  return channel;
}