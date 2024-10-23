const getMemberRoles = require("../getMemberRoles")

module.exports = (settings, message) => {
  const member = message.guild.members.cache.get(message.author.id);
  const userRoles = getMemberRoles(member);
  const globMult = settings.globalMultiplier;
  const roleMult = JSON.parse(settings.roleMultipliers);
  const chanMult = JSON.parse(settings.channelMultipliers);
  const roleBlkList = JSON.parse(settings.blackListRoles);
  const chanBlkList = JSON.parse(settings.blackListChannels);
  if (chanBlkList.some(item => item.channelId === message.channel.id)) return 0;
  if (roleBlkList.some(item => userRoles.some(role => role === item.roleId))) return 0;
  const random = Math.floor(Math.random() * (25 - 15 + 1)) + 15
  let totalXp = random;
  let findChanMult = chanMult.find(item => item.channelId === message.channel.id)
  if (findChanMult) {
    totalXp += Math.round(totalXp * (findChanMult.value / 100));
  } else {
    totalXp += Math.round(totalXp * (globMult / 100));
  }
  roleMult.forEach(item => {
    if (userRoles.includes(item.roleId)){
      totalXp += Math.round(totalXp * (item.value / 100));
    }
  });
  return totalXp;
}