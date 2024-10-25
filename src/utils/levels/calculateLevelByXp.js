const calculateXpByLevel = require("./calculateXpByLevel");

module.exports = (userXp) => {
  const initialLevel = 0;

  let totalLevel = initialLevel;
  let xp = calculateXpByLevel(totalLevel);
  while (userXp > xp) {
    totalLevel += 1;
    xp = calculateXpByLevel(totalLevel);
  }
  return totalLevel;
}