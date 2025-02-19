const { selectData } = require("../services/database/selectData");
const { insertData } = require("../services/database/insertData");
const { updateData } = require("../services/database/updateData");
const exportToJson = require("../services/database/exportDataToJson");

async function getUserStats(guildId, memberId) {
  return await selectData('UserStats', {guildId: guildId, memberId: memberId});
}

async function getUserAttempts(guildId, memberId) {
  try {
    let data = await getUserStats(guildId, memberId);
    if (!data) {
      await insertData('UserStats', { guildId: guildId, memberId: memberId });
      data = await getUserStats(guildId, memberId);
      await exportToJson('UserStats', guildId);
    }
    return JSON.parse(data.attempts);
  } catch (error) {
    console.error('Error fetching UserStats:', error);
    return null;
  }
}

async function updateUserAttempts(guildId, memberId, targetId, action, cmdKey, special = false) {
  let userAttempts = await getUserAttempts(guildId, memberId);
  try {
    if (!userAttempts[action]) userAttempts[action] = {};
    if (!userAttempts[action][cmdKey]) userAttempts[action][cmdKey] = {}
    if (special) {
      if (!userAttempts[action][cmdKey]) userAttempts[action][cmdKey] = {};
      if(!userAttempts[action][cmdKey][targetId]) {
        userAttempts[action][cmdKey][targetId] = { temp: 1, total: 0 };
      } else {
        userAttempts[action][cmdKey][targetId].temp += 1;
      }
    } else {
      if (!userAttempts[action][cmdKey][targetId]) {
        userAttempts[action][cmdKey][targetId] = { total: 1 };
      } else {
        userAttempts[action][cmdKey][targetId].total += 1;
      }
    }
    await setUserAttempts(guildId, memberId, JSON.stringify(userAttempts))
  } catch (error) {
    console.error(`Error Updating User Attempts for user ${memberId} in guild ${guildId}:`, error);
  }
  await exportToJson('UserStats', guildId);
}

async function setUserAttempts(guildId, memberId, userAttempts) {
  try {
    await updateData('UserStats', { guildId: guildId, memberId: memberId}, {attempts: userAttempts });
  } catch (error) {
    console.error(`Error Setting User Attempts for user ${memberId} in guild ${guildId}:`, error);
  }
  await exportToJson('UserStats', guildId);
}

async function resetUserAttempts(guildId, memberId, targetId, action, cmdKey) {
  try {
    let userAttempts = await getUserAttempts(guildId, memberId);
    if (userAttempts) {
      userAttempts[action][cmdKey][targetId].total += userAttempts[action][cmdKey][targetId].temp;
      userAttempts[action][cmdKey][targetId].temp = 0;
      await setUserAttempts(guildId, memberId, JSON.stringify(userAttempts));
    } else {
      console.warning('User Attempts were not found.');
    }
  } catch (error) {
    console.error('Error resetting userAttempts:', error);
  }
}

module.exports = { getUserAttempts, setUserAttempts, updateUserAttempts, resetUserAttempts };