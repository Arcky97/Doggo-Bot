const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

async function getAllUsersLevel(guildId) {
  try {
    return await selectData('LevelSystem', {guildId: guildId }, true);
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

async function setUserLevelInfo(user, keys, data) {
  if (user) {
    await updateData('LevelSystem', keys, data);
  } else {
    await insertData('LevelSystem', keys, data);
  }
  exportToJson('LevelSystem');
}

async function resetLevelSystem(id, member) {
  try {
    if (member) {
      await deleteData('LevelSystem', {guildId: id, memberId: member.id});
    } else {
      await deleteData('LevelSystem', {guildId: id});
    }
  } catch (error) {
    console.error('Failed to Reset Level(s)', error);
  }

  exportToJson('LevelSystem');
}

module.exports = { getAllUsersLevel, getUserLevel, addUserColor, setUserLevelInfo, resetLevelSystem }