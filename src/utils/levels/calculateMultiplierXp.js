const getMemberRoles = require("../logging/getMemberRoles")

module.exports = (settings, message, xpSettings) => {
  const member = message.guild.members.cache.get(message.author.id);
  const userRoles = getMemberRoles(member);

  const globMult = settings.globalMultiplier;
  const roleMult = JSON.parse(settings.roleMultipliers);
  const chanMult = JSON.parse(settings.channelMultipliers);
  const catMult = JSON.parse(settings.categoryMultipliers);
  const multRepl = JSON.parse(settings.multiplierReplace);

  const roleBlkList = JSON.parse(settings.blackListRoles);
  const chanBlkList = JSON.parse(settings.blackListChannels);
  const catBlkList = JSON.parse(settings.blackListCategories);

  const minXp = xpSettings.min;
  const maxXp = xpSettings.max;

  if (catBlkList.some(item => item.categoryId === message.channel.parent.id)) return 0 ;
  if (chanBlkList.some(item => item.channelId === message.channel.id)) return 0;
  if (roleBlkList.some(item => userRoles.some(role => role === item.roleId))) return 0;

  const random = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
  let totalXp = random;

  let totalMultiplier = 0;
  const findCatMult = catMult.find(item => item.categoryId === message.channel.parent.id);
  const findChanMult = chanMult.find(item => item.channelId === message.channel.id);
  
  if (findChanMult) {
    totalMultiplier = findChanMult.value;
    if (!multRepl.channel && !findChanMult.replace) {
      totalMultiplier += globMult;
    }
  } else if (findCatMult) {
    totalMultiplier = findCatMult.value;
    if (!multRepl.category && !findCatMult.replace) {
      totalMultiplier += globMult; 
    }
  } else {
    totalMultiplier = globMult;
  }

  roleMult.forEach(item => {
    if (userRoles.includes(item.roleId)){
      totalMultiplier += item.value; 
    }
  });

  totalXp = Math.round(totalXp * (Math.min(totalMultiplier, 1100) / 100));
  return totalXp;
}