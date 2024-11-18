const { getLevelSettings } = require("../../../database/levelSystem/setLevelSettings")

module.exports = async (guildId, channelId, timeSpent) => {
  const levelSettings = await getLevelSettings(guildId);
  const voiceMult = levelSettings.voiceMultiplier;
  const voiceCooldown = levelSettings.voiceCooldown;
  const chanMult = JSON.parse(levelSettings.channelMultipliers);
  const chanBlkList = JSON.parse(levelSettings.blackListChannels);
  const xpSettings = JSON.parse(levelSettings.xpSettings);
  const minXp = xpSettings.min;
  const maxXp = xpSettings.max;

  if (chanBlkList.some(item => item.channelId = channelId)) return 0;
  let totalXp = 0;
  let random;
  let findChanMult = chanMult.find(item => item.channelId === channelId);
  const multiplier = findChanMult.value || voiceMult;

  for (let i = 0; i < timeSpent - voiceCooldown; i += voiceCooldown) {
    random = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
    totalXp += Math.round(random * (multiplier) / 100);
    console.log('The earned random XP', random);
    console.log('The new total XP:', totalXp);
  }
  return totalXp;
}