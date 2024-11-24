const calculateXpByLevel = require("./calculateXpByLevel");

module.exports = (userXp, xpSettings) => {
  const initialLevel = 0;
  let totalLevel = initialLevel;
  let xp = calculateXpByLevel(totalLevel, xpSettings);
  while (userXp > xp) {
    totalLevel += 1;
    xp = calculateXpByLevel(totalLevel, xpSettings);
  }
  return totalLevel - 1;
}