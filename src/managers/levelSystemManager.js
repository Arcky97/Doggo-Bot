import { selectData } from "../services/database/selectData.js";
import { insertData } from "../services/database/insertData.js";
import { updateData } from "../services/database/updateData.js";
import { deleteData } from "../services/database/deleteData.js";

export async function getAllGuildUsersLevel(guildId) {
  try {
    return await selectData('LevelSystem', {guildId: guildId }, true);
  } catch (error) {
    console.error('Error fetching users from LevelSystem:', error);
    return [];
  }
}

export async function getAllGlobalUsersLevel() {
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

export async function getUserLevel(guildId, memberId) {
  const data = await selectData('LevelSystem', { guildId: guildId, memberId: memberId });
  return data || { level: 0, xp: 0, color: '#f97316'};
}

export async function addUserColor(guildId, memberId, color) {
  await updateData('LevelSystem', { guildId: guildId, memberId: memberId} , {color: color });
}

export async function setUserLevelInfo(user, keys, data) {
  if (user.xp !== 0 || user.level !== 0) {
    await updateData('LevelSystem', keys, data);
  } else {
    await insertData('LevelSystem', keys, data);
  }
}

export async function resetLevelSystem(id, member) {
  try {
    if (member) {
      await deleteData('LevelSystem', {guildId: id, memberId: member.id});
    } else {
      await deleteData('LevelSystem', {guildId: id});
    }
  } catch (error) {
    console.error('Failed to Reset Level(s)', error);
  }
}