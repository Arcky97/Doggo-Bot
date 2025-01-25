const getMemberRoles = require("../logging/getMemberRoles")

module.exports = ({settings, user, channel, roles, notRandom, message, premiumServer}) => {
  // if roles are given, use roles, otherwise get the user roles.
  const userRoles = roles ? roles : getMemberRoles(user);
  const globMult = settings.globalMultiplier;
  const roleMult = JSON.parse(settings.roleMultipliers);
  const chanMult = JSON.parse(settings.channelMultipliers);
  const catMult = JSON.parse(settings.categoryMultipliers);
  const multRepl = JSON.parse(settings.multiplierReplace);

  const roleBlkList = JSON.parse(settings.blackListRoles);
  const chanBlkList = JSON.parse(settings.blackListChannels);
  const catBlkList = JSON.parse(settings.blackListCategories);

  const minXp = JSON.parse(settings.xpSettings).min;
  const maxXp = JSON.parse(settings.xpSettings).max;
  const minLength = JSON.parse(settings.xpSettings).minLength;
  const maxLength = JSON.parse(settings.xpSettings).maxLength;

  if (catBlkList.some(item => item.categoryId === channel.parent?.id)) return notRandom ? [0, 0] : 0;
  if (chanBlkList.some(item => item.channelId === channel.id)) return notRandom ? [0, 0] : 0;
  if (roleBlkList.some(item => userRoles.some(role => role === item.roleId))) return notRandom ? [0, 0] : 0;

  let baseXP;
  if (premiumServer && settings.xpType === 'length') {
    message.content = message.content
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/(.)\1{3,}/g, '$1$1$1')
      .replace(/\s/g, '');
    if (message.content.length === 0) return 0;
    const msgLength = message.content.length;
    baseXP = Math.ceil((msgLength - minLength) / (maxLength - minLength) * (maxXp - minXp) + minXp);
  } else {
    baseXP = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
  }
    
  let totalXp = baseXP;
  let totalMinXp = minXp;
  let totalMaxXp = maxXp;

  let totalMultiplier = 0;
  
  const findCatMult = catMult.find(item => item.categoryId === channel.parent?.id);
  const findChanMult = chanMult.find(item => item.channelId === channel.id);
  
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

  if (notRandom) {
    totalMinXp = Math.round(totalMinXp * (Math.min(totalMultiplier, 1100) / 100));
    totalMaxXp = Math.round(totalMaxXp * (Math.min(totalMultiplier, 1100) / 100));
    return [totalMinXp, totalMaxXp];
  } else {
    totalXp = Math.round(totalXp * (Math.min(totalMultiplier, 1100) / 100));
    return totalXp;
  }
}