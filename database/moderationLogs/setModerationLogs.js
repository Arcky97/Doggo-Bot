const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");
const { query } = require("../db");

async function getModerationLogs({guildId, userId, action}) {
  const keys = {
    guildId: guildId,
    userId: userId,
    action: action
  }
  try {
    for (const key in keys) {
      if (keys[key] === undefined) {
        delete keys[key];
      }
    }
    return await selectData('ModerationLogs', keys, true);
  } catch (error) {
    console.error('Error getting Moderation Logs:', error);
  }
}

async function getModerationLogsById(guildId, id) {
  try {
    const data = await selectData('ModerationLogs', {guildId: guildId, id: id});
    if (data) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting Moderation Logs by ID:', error);
  }
}

/**
 * @returns {Promise<number>}
 */
async function nextModerationLogId() {
  const maxIdQuery = `
    SELECT MAX(Id) AS maxId
    FROM ModerationLogs
  `;

  try {
    const [[{ maxId }]] = await query(maxIdQuery);
    return (maxId || 0) + 1;  
  } catch (error) {
    console.error('Error getting next Moderation Log ID:', error);
  }
}

async function addModerationLogs({guildId, userId, modId, action, reason, duration}) {
  try {
    const data = {
      guildId: guildId,
      userId: userId,
      modId: modId,
      action: action,
    }
    if (reason) data.reason = reason;
    if (duration) data.endTime = duration;
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
    const data = await getModerationLogs({guildId: guildId, userId: userId, action: action});
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
  getModerationLogs, addModerationLogs, removeModerationLogs, clearModerationLogs, nextModerationLogId, getModerationLogsById
}