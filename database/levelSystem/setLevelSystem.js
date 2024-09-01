const { insertData } = require("../controlData/insertData");
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
  return await selectData('LevelSystem', { guildId: guildId, memberId: memberId });
}

async function addUserColor(guildId, memberId, color) {
  await insertData('LevelSystem', { guildId: guildId, memberId: memberId, color: color });
}

module.exports = { getAllUsersLevel, getUserLevel, addUserColor }