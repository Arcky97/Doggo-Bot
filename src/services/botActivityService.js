const { ActivityType } = require('discord.js');
const devServerService = require('./devServerService');

module.exports = async () => {
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


  const channelId = '1273771024801861734';
  await devServerService(channelId, 'Bot has started/restarted successfully!');
}