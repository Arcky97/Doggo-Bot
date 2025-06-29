const getXpFromLevel = require("./getXpFromLevel");

module.exports = (userXp, xpSettings) => {
  const initialLevel = 0;
  let totalLevel = initialLevel;
  let xp = getXpFromLevel(totalLevel, xpSettings);
  while (userXp > xp) {
    totalLevel += 1;
    xp = getXpFromLevel(totalLevel, xpSettings);
  }
  return Math.max(totalLevel - 1, 0);
}