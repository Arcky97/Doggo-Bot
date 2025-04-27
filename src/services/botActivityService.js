const { ActivityType } = require('discord.js');
const devServerService = require('./devServerService');

module.exports = async (message) => {
  let serverCount = totalMembers = 0;
  client.guilds.cache.forEach(guild => {
    totalMembers += guild.memberCount - 1;
    serverCount ++;
  });

  const server = serverCount > 1 ? 'Servers' : 'Server';
  client.user.setActivity({
    name: `${totalMembers} Users in ${serverCount} ${server}!`,
    type: ActivityType.Watching,
  });

  // bot-logs channel
  const channelId = '1314702619196784743';
  await devServerService(channelId, `${message} successfully!`);
}