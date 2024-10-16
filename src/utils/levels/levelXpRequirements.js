const { exportToJson } = require("../../../database/controlData/visualDatabase/exportToJson");
const { query } = require("../../../database/db");

async function levelXpRequirements() {
  const initialXp = 35;
  const incrementStep = 40;

  let totalXp = initialXp;
  let currentIncrement = 20;
  
  for (let level = 1; level <= 1111; level++) {
    if (level > 1) {
      totalXp += currentIncrement;
      currentIncrement += incrementStep
    }
  
    //console.log(`Level ${level}: ${totalXp} XP`);
  
    await query('INSERT INTO LevelXpRequirements (level, requiredXp) VALUES (?, ?)', [level, totalXp]);
    
  }
  
  exportToJson('LevelXpRequirements');
}

module.exports = { levelXpRequirements };