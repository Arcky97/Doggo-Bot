const exportToJson = require("../../src/handlers/exportToJson");
const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");

async function addActiveTimeout(id, guildId, timeoutId) {
  try {
    const data = selectData('ModerationActiveTimeouts', { id: id});
    if (data) {
      await updateData('ModerationActiveTimeouts', { id: id }, { guildId: guildId, timeoutId: timeoutId });
    } else {
      await insertData('ModerationActiveTimeouts', { id: id }, { guildId: guildId, timeoutId: timeoutId });
    }
    await exportToJson('ModerationActiveTimeouts', guildId);
  } catch (error) {
    console.error('Error inserting data in ModerationActiveTimeouts table:', error);
  }
}

async function removeActiveTimeout(id, guildId) {
  try {
    await deleteData('ModerationActiveTimeouts', { id: id });
    await exportToJson('ModerationActiveTimeouts', guildId);
  } catch (error) {
    console.error('Error removing data in ModerationActiveTimeouts table:', error);
  }
}

module.exports = { addActiveTimeout, removeActiveTimeout };