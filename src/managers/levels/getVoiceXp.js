const { getLevelSettings } = require("../../managers/levelSettingsManager")

module.exports = async (guildId, channel, timeSpent) => {
  const levelSettings = await getLevelSettings(guildId);

  const voiceMult = levelSettings.voiceMultiplier;
  const voiceCooldown = levelSettings.voiceCooldown;

  const chanMult = JSON.parse(levelSettings.channelMultipliers);
  const chanBlkList = JSON.parse(levelSettings.blackListChannels);

  const catMult = JSON.parse(levelSettings.categoryMultipliers);
  const catBlkList = JSON.parse(levelSettings.blackListCategories);

  const multRepl = JSON.parse(levelSettings.multiplierReplace);

  const xpSettings = JSON.parse(levelSettings.xpSettings);
  const minXp = xpSettings.min;
  const maxXp = xpSettings.max;

  if (catBlkList.some(item => item.categoryId === channel.parent.id)) return 0;
  if (chanBlkList.some(item => item.channelId === channel.id)) return 0;
  
  let totalXp = 0;
  let multiplier = 0;
  let random;

  const findCatMult = catMult.find(item => item.categoryId === channel.parent.id);
  const findChanMult = chanMult.find(item => item.channelId === channel.id);
  
  if (findChanMult) {
    multiplier = findChanMult.value;
    if (!multRepl.channel && !findChanMult.replace) {
      multiplier += voiceMult;
    }
  } else if (findCatMult) {
    multiplier = findCatMult.value;
    if (!multRepl.category && !findCatMult.replace) {
      multiplier += voiceMult;
    }
  } else {
    multiplier = voiceMult;
  }

  for (let i = 0; i < timeSpent - voiceCooldown; i += voiceCooldown) {
    random = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
    totalXp += Math.round(random * (Math.min(multiplier, 1100)) / 100);
  }
  return totalXp;
}