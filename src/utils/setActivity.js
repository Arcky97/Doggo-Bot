const { ActivityType } = require('discord.js');

module.exports = async (client) => {
  let serverCount = totalMembers = 0;
  client.guilds.cache.forEach(guild => {
    totalMembers += guild.memberCount - 1;
    serverCount ++;
  });

  client.user.setActivity({
    name: `${totalMembers} Users in ${serverCount} Server!`,
    type: ActivityType.Watching,
  })
}