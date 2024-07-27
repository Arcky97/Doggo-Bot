const { ActivityType } = require('discord.js');

module.exports = (client) => {
  console.log(`'${client.user.username}' is ready!`);

  let serverCount = totalMembers = 0;
  client.guilds.cache.forEach(guild => {
    totalMembers += guild.memberCount - 1;
    serverCount ++;
  });

  client.user.setActivity({
    name: `${totalMembers} Users in ${serverCount} Server!`,
    type: ActivityType.Watching,
  })
};