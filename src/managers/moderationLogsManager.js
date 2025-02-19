const { selectData } = require("../services/database/selectData");
const { insertData } = require("../services/database/insertData");
const { deleteData } = require("../services/database/deleteData");
const exportToJson = require("../services/database/exportDataToJson");
const { query } = require("./databaseManager");
const { updateData } = require("../services/database/updateData");

async function getModerationLogs({guildId, userId, action, last}) {
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
    const data = await selectData('ModerationLogs', keys, true);
    if (last) {
      return data.at(-1);
    } else {
      return data;
    }
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
  const autoIncrementQuery = `
    SHOW TABLE STATUS LIKE 'ModerationLogs';
  `;

  try {
    const [[{ Auto_increment }]] = await query(autoIncrementQuery);
    return Auto_increment;  
  } catch (error) {
    console.error('Error getting next Moderation Log ID:', error);
  }
}

/**
 * Adds a Moderation Log entry to the 'ModerationLogs' table in the database.
 * 
 * @param {Object} params - The parameters for the Moderation Log entry.
 * @param {string} params.guildId - The ID of the guild.
 * @param {string} params.userId - The ID of the target user.
 * @param {string} params.modId - The ID of the Moderator.
 * @param {string} params.action - The type of Moderation (e.g. 'warn', 'timeout', 'timeout remove', 'mute', 'unmute', 'kick', 'ban', 'unban')
 * @param {string} [params.reason] - The reason the Moderation action was taken.
 * @param {string} [params.status] - The status of the Moderation action (e.g. 'completed', 'pending', 'scheduled', 'failed')
 * @param {string} [params.formatDuration] - The formatted duration of the Moderation action.
 * @param {boolean} params.logging - Wheter to Log the Moderation action to the Moderation Log channel (default true).
 * @param {string} [params.logChannel] - The Channel ID of the Moderation Log channel (if setup).
 * @param {string} [params.data] - The date the Moderation action was taken.
 * @param {string} [params.duration] - The duration of the Moderation action.
 */
async function addModerationLogs({guildId, userId, modId, action, reason, status, formatDuration, logging, logChannel, date, duration}) {
  try {
    const data = {
      guildId: guildId,
      userId: userId,
      modId: modId,
      action: action,
      logging: logging,
    }
    if (reason) data.reason = reason;
    if (status) data.status = status;
    if (formatDuration) data.formatDuration = formatDuration;
    if (logChannel) data.logChannel = logChannel;
    if (date) data.date = date;
    if (duration) data.endTime = duration;
    //console.log(data);
    await insertData('ModerationLogs', {}, data);
    exportToJson('ModerationLogs', guildId);
  } catch (error) {
    console.error('Error adding Moderation Log:', error);
  }
}

async function addModerationLogTimeoutId(id, guildId, timeoutId) {
  try {
    await updateData('ModerationLogs', { id: id }, { timeoutId: timeoutId });
    exportToJson('ModerationLogs', guildId);
  } catch (error) {
    console.error('Error adding Timeout ID to Moderation Log:', error);
  }
}

async function getModerationLogTimeoutId(guildId, userId, action) {
  try {
    const data = await selectData('ModerationLogs', { guildId: guildId, userId: userId, action: action });
    if (data) {
      return data.timeoutId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting timeoutId from Moderation Logs:', error);
  }
}
async function setModerationLogStatus(id, guildId, status) {
  try {
    if (['completed', 'pending', 'scheduled', 'failed'].includes(status)) {
      await updateData('ModerationLogs', {id: id}, {status: status});
      exportToJson('ModerationLogs', guildId);
    } else {
      console.error('Ivalid status:', status);
    }
  } catch (error) {
    console.error('Error setting Moderation Log status as completed:', error);
  }
}

async function removeModerationLogs(guildId, id) {
  try {
    await deleteData('ModerationLogs', {id: id});
    exportToJson('ModerationLogs', guildId);
  } catch (error) {
    console.error('Error removing Moderation Log:', error);
  }
}

async function clearModerationLogs(guildId, userId, action) {
  try {
    const data = await getModerationLogs({guildId: guildId, userId: userId, action: action});
    if (data.length > 0) {
      data.forEach(async log => {
        await removeModerationLogs(guildId, log.id);
      });
    }
  } catch (error) {
    console.error('Error clearing Moderation Logs:', error);
  }
}

module.exports = {
  getModerationLogs, addModerationLogs, addModerationLogTimeoutId, getModerationLogTimeoutId, setModerationLogStatus, removeModerationLogs, clearModerationLogs, nextModerationLogId, getModerationLogsById
}