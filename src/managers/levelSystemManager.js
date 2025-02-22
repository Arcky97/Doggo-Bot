const { selectData } = require("../services/database/selectData");
const { insertData } = require("../services/database/insertData");
const { updateData } = require("../services/database/updateData");
const { deleteData } = require("../services/database/deleteData");
const exportToJson = require("../services/database/exportDataToJson");

async function getAllGuildUsersLevel(guildId) {
  try {
    return await selectData('LevelSystem', {guildId: guildId }, true);
  } catch (error) {
    console.error('Error fetching users from LevelSystem:', error);
    return [];
  }
}

async function getAllGlobalUsersLevel() {
  try {
    let data = await Promise.all(client.guilds.cache.map(async guild => {
      return await getAllGuildUsersLevel(guild.id);
    }));

    const merged = data.flat().reduce((acc, { memberId, xp}) => {
      if (!acc[memberId]) {
        acc[memberId] = { userId: memberId, xp: 0 };
      }
      acc[memberId].xp += xp;
      return acc;
    }, {});
    const result = Object.values(merged).sort((a, b) => b.xp - a.xp);

    return result;
  } catch (error) {
    console.error('Error fetching all users from LevelSystem:', error);
    return [];
  }
}

async function getUserLevel(guildId, memberId) {
  const data = await selectData('LevelSystem', { guildId: guildId, memberId: memberId });
  return data || { level: 0, xp: 0, color: '#f97316'};
}

async function addUserColor(guildId, memberId, color) {
  await updateData('LevelSystem', { guildId: guildId, memberId: memberId} , {color: color });
  exportToJson('LevelSystem', guildId)
}

async function setUserLevelInfo(user, keys, data) {
  if (user.xp !== 0 || user.level !== 0) {
    await updateData('LevelSystem', keys, data);
  } else {
    await insertData('LevelSystem', keys, data);
  }
  exportToJson('LevelSystem', keys.guildId);
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
  exportToJson('LevelSystem', id);
}

module.exports = { 
  getAllGuildUsersLevel, 
  getAllGlobalUsersLevel,
  getUserLevel, 
  addUserColor, 
  setUserLevelInfo, 
  resetLevelSystem 
}