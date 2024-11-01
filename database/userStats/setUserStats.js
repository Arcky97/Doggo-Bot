const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

async function getUserStats(guildId, memberId) {
  return await selectData('UserStats', {guildId: guildId, memberId: memberId});
}

async function getUserAttempts(guildId, memberId) {
  try {
    let data = await getUserStats(guildId, memberId);
    if (!data) {
      await insertData('UserStats', { guildId: guildId, memberId: memberId });
      data = await getUserStats(guildId, memberId);
      await exportToJson('UserStats');
    }
    return JSON.parse(data.attempts);
  } catch (error) {
    console.error('Error fetching UserStats:', error);
    return null;
  }
}

async function setUserAttempts(guildId, memberId, attempts) {
  try {
    await updateData('UserStats', { guildId: guildId, memberId: memberId}, {attempts: attempts});
  } catch (error) {
    console.error(`Error Updating User Attempts for user ${memberId} in guild ${guildId}:`, error);
  }
  await exportToJson('UserStats');
}

module.exports = { getUserAttempts, setUserAttempts };