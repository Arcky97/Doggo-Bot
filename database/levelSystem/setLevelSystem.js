const { selectData } = require("../controlData/selectData");
const { query } = require("../db");

async function getAllUsersLevel(guildId) {
  try {
    const rows = await query(`SELECT * FROM LevelSystem WHERE guildId = ${guildId}`);
    return rows[0];
  } catch (error) {
    console.error('Error fetching users from LevelSystem:', error);
    return [];
  }
}

async function getUserLevel(guildId, memberId) {
  return selectData('LevelSystem', { guildId: guildId, memberId: memberId });
}

module.exports = { getAllUsersLevel, getUserLevel }