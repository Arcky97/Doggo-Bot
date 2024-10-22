const { ActivityType } = require('discord.js');

module.exports = async (client) => {
  let serverCount = totalMembers = 0;
  client.guilds.cache.forEach(guild => {
    console.log(guild.ownerId);
    totalMembers += guild.memberCount - 1;
    serverCount ++;
  });

  const server = serverCount > 1 ? 'Servers' : 'Server';
  client.user.setActivity({
    name: `${totalMembers} Users in ${serverCount} ${server}!`,
    type: ActivityType.Watching,
  });

  const channelId = '1273771024801861734'; // Your channel ID here
  const channel = client.channels.cache.get(channelId);
  
  if (channel) {
    try {
      await channel.send(`Bot has started/restarted successfully!`);
    } catch (error) {
      console.error(`Failed to send message to channel ${channelId}:`, error);
    }
  } else {
    console.error(`Channel with ID ${channelId} not found!`);
  }
}