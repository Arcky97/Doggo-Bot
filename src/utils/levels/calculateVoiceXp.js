const { getLevelSettings } = require("../../../database/levelSystem/setLevelSettings")


module.exports = async (guildId, timeSpent) => {
  const levelSettings = await getLevelSettings(guildId);
  const voiceMultiplier = levelSettings.voiceMultiplier;
  const voiceCooldown = levelSettings.voiceCooldown;
  const xpSettings = JSON.parse(levelSettings.xpSettings);
  const minXp = xpSettings.min;
  const maxXp = xpSettings.max;
  let totalXp = 0;
  let random;
  for (let i = 0; i < timeSpent - voiceCooldown; i += voiceCooldown) {
    random = Math.floor(Math.random() * (maxXp - minXp + 1)) + minXp;
    totalXp += Math.round(random * (voiceMultiplier) / 100);
    console.log('The earned random XP', random);
    console.log('The new total XP:', totalXp);
  }
  return totalXp;
}