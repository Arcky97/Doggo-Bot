const { setBotStats } = require("../../../database/BotStats/setBotStats");
const { getUserLevel, setUserLevelInfo } = require("../../../database/levelSystem/setLevelSystem");
const calculateLevelByXp = require("./calculateLevelByXp");
const calculateXpByLevel = require("./calculateXpByLevel");

module.exports = async (guildId, user, xpToGive, xpSettings) => {
  const userLvInfo = await getUserLevel(guildId, user.id) 

  const newXp = userLvInfo.xp + xpToGive;
  const newLevel = calculateLevelByXp(newXp, xpSettings);
  const nextLevelXp = calculateXpByLevel(userLvInfo.level + 1, xpSettings);

  let userInfo;

  if (newXp > nextLevelXp || newLevel > userLvInfo.level) {
    userInfo = {
      level: newLevel,
      xp: newXp,
      color: userLvInfo.color
    }
    await setUserLevelInfo(userLvInfo, { guildId: guildId, memberId: user.id }, { level: newLevel, xp: newXp });
  } else {
    await setUserLevelInfo(userLvInfo, { guildId, memberId: user.id }, { xp: newXp });
  }
  
  const levelCounter = { "xp": Math.max((newXp - userLvInfo.xp), 0), "levels": Math.max((newLevel - userLvInfo.level), 0) };
  await setBotStats(guildId, 'levelSystem', levelCounter);

  return userInfo;
}