const { selectData } = require("../controlData/selectData");
const { insertData } = require("../controlData/insertData");
const { updateData } = require("../controlData/updateData");
const exportToJson = require("../../src/handlers/exportToJson");

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

async function setUserAttempts(guildId, memberId, attempts) {
  try {
    await updateData('UserStats', { guildId: guildId, memberId: memberId}, {attempts: attempts});
  } catch (error) {
    console.error(`Error Updating User Attempts for user ${memberId} in guild ${guildId}:`, error);
  }
  await exportToJson('UserStats', guildId);
}

module.exports = { getUserAttempts, setUserAttempts };