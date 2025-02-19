const { query } = require("../../managers/databaseManager");

module.exports = async () => {
  const initialXp = 35;
  const incrementStep = 40;

  let totalXp = initialXp;
  let currentIncrement = 20;
  
  for (let level = 1; level <= 1111; level++) {
    if (level > 1) {
      totalXp += currentIncrement;
      currentIncrement += incrementStep
    }  
    await query('INSERT INTO LevelXpRequirements (level, requiredXp) VALUES (?, ?)', [level, totalXp]);   
  }
  //exportToJson('LevelXpRequirements');
}