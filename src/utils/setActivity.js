const { ActivityType } = require('discord.js');
const sendMessageToDevServer = require('./sendMessageToDevServer');

module.exports = async (client) => {
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
  await sendMessageToDevServer(client, channelId, 'Bot has started/restarted successfully!');
}