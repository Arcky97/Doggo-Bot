import { selectData } from "../services/database/selectData.js";
import { insertData } from "../services/database/insertData.js";
import { deleteData } from "../services/database/deleteData.js";
import { query } from "./databaseManager.js";
import { updateData } from "../services/database/updateData.js";

export async function getModerationLogs({guildId, userId, action, last}) {
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

export async function getModerationLogsById(guildId, id) {
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
export async function nextModerationLogId() {
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
export async function addModerationLogs({guildId, userId, modId, action, reason, status, formatDuration, logging, logChannel, date, duration}) {
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
    await insertData('ModerationLogs', {}, data);
  } catch (error) {
    console.error('Error adding Moderation Log:', error);
  }
}

export async function addModerationLogTimeoutId(id, guildId, timeoutId) {
  try {
    await updateData('ModerationLogs', { id: id }, { timeoutId: timeoutId });
  } catch (error) {
    console.error('Error adding Timeout ID to Moderation Log:', error);
  }
}

export async function getModerationLogTimeoutId(guildId, userId, action) {
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

export async function setModerationLogStatus(id, guildId, status) {
  try {
    if (['completed', 'pending', 'scheduled', 'failed'].includes(status)) {
      await updateData('ModerationLogs', {id: id}, {status: status});
    } else {
      console.error('Ivalid status:', status);
    }
  } catch (error) {
    console.error('Error setting Moderation Log status as completed:', error);
  }
}

export async function removeModerationLogs(guildId, id) {
  try {
    await deleteData('ModerationLogs', {id: id});
  } catch (error) {
    console.error('Error removing Moderation Log:', error);
  }
}

export async function clearModerationLogs(guildId, userId, action) {
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