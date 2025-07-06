import { ActivityType } from 'discord.js';
import devServerService from './devServerService.js';

export default async (message) => {
  let serverCount = 0;
  let totalMembers = serverCount;
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