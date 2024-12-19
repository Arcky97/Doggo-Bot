const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

async function getModerationLogs(guildId, userId, action) {
  try {
    return await selectData('ModerationLogs', {guildId: guildId, userId: userId, action: action}, true);
  } catch (error) {
    console.error('Error getting Moderation Logs:', error);
    return [];
  }
}

async function addModerationLogs({guildId, userId, modId, action, reason, duration}) {
  try {
    const data = {
      guildId: guildId,
      userId: userId,
      modId: modId,
      action: action,
      reason: reason
    }
    await insertData('ModerationLogs', {}, data);
    exportToJson('ModerationLogs');
  } catch (error) {
    console.error('Error adding Moderation Log:', error);
  }
}

async function removeModerationLogs(id) {
  try {
    await deleteData('ModerationLogs', {id: id});
    exportToJson('ModerationLogs');
  } catch (error) {
    console.error('Error removing Moderation Log:', error);
  }
}

async function clearModerationLogs(guildId, userId, action) {
  try {
    const data = await getModerationLogs(guildId, userId, action);
    if (data.length > 0) {
      data.forEach(async (log) => {
        await removeModerationLogs(log.id);
      });
    }
  } catch (error) {
    console.error('Error clearing Moderation Logs:', error);
  }
}

module.exports = {
  getModerationLogs, addModerationLogs, removeModerationLogs, clearModerationLogs
}