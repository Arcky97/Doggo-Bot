const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");
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
  await updateData('LevelSystem', { guildId: guildId, memberId: memberId} , {color: color });
  exportToJson('LevelSystem')
}

module.exports = { getAllUsersLevel, getUserLevel, addUserColor }