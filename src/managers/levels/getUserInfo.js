const { setBotStats } = require("../../managers/botStatsManager");
const { getUserLevel, setUserLevelInfo } = require("../../managers/levelSystemManager");
const getLevelFromXp = require("./getLevelFromXp");
const getXpFromLevel = require("./getXpFromLevel");

module.exports = async (guildId, user, xpToGive, xpSettings) => {
  const userLvInfo = await getUserLevel(guildId, user.id) 

  const newXp = userLvInfo.xp + xpToGive;
  const newLevel = getLevelFromXp(newXp, xpSettings);
  const nextLevelXp = getXpFromLevel(userLvInfo.level + 1, xpSettings);

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