const exportToJson = require("../../src/handlers/exportToJson");
const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");

async function addModerationIdsToCheck(id, guildId, duration, logging, logChannel) {
  try {
    await insertData('ModerationIdsToCheck', { id: id }, { guildId: guildId, formatDuration: duration, logging: logging, logChannel: logChannel });
    await exportToJson('ModerationIdsToCheck', guildId);
  } catch (error) {
    console.error('Error inserting data in ModerationIdsToCheck table:', error);
  }
}

async function removeModerationIdsToCheck(id, guildId) {
  try {
    await deleteData('ModerationIdsToCheck', { id: id });
    await exportToJson('ModerationIdsToCheck', guildId);
  } catch (error) {
    console.error('Errro removing data in ModerationIdsToCheck table:', error);
  }
}

async function getModerationIdsToCheck() {
  try {
    return await selectData('ModerationIdsToCheck', {}, true);
  } catch (error) {
    console.error('Error getting data from ModearationIdsToCheck table:', error);
  }
}

module.exports = { addModerationIdsToCheck, removeModerationIdsToCheck, getModerationIdsToCheck };