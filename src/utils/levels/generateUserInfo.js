const { getUserLevel, setUserLevelInfo } = require("../../../database/levelSystem/setLevelSystem");
const calculateLevelByXp = require("./calculateLevelByXp");
const calculateXpByLevel = require("./calculateXpByLevel");

module.exports = async (guildId, user, xpToGive, xpSettings) => {
  const userLvInfo = await getUserLevel(guildId, user.id) 

  const newXp = userLvInfo.xp + xpToGive;
  const newLevel = calculateLevelByXp(newXp, xpSettings);
  const nextLevelXp = calculateXpByLevel(userLvInfo.level + 1, xpSettings);

  let userInfo = null;

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

  return userInfo;
}