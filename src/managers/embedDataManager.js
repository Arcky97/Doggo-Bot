const { deleteData } = require("../services/database/deleteData");
const { insertData } = require("../services/database/insertData");
const { selectData } = require("../services/database//selectData");
const { updateData } = require("../services/database//updateData");
const exportToJson = require("../services/database/exportDataToJson");

const getUniq = (table, messageOrType) => {
  return table === 'GeneratedEmbeds' ? { messageId: messageOrType } : { type: messageOrType }
}

async function setEmbed(table, guildId, channel, messageOrType, data) {
  const keys = {
    guildId: guildId,
    channelId: channel,
    ...getUniq(table, messageOrType)
  };
  await setEmbedData(table, guildId, keys, data);
}

async function getOrDeleteEmbed(table, action, guildId, messageOrType) {
  const keys = {
    guildId: guildId,
    ...getUniq(table, messageOrType) 
  };
  if (action === 'get') {
    return await selectData(table, keys);
  } else {
    await deleteData(table, keys);
    exportToJson(table, guildId);
  }
}

async function setEmbedData(table, guildId, keys, data) {
  const dataExist = await selectData(table, keys);
  try {
    if (!dataExist) {
      await insertData(table, keys, data);
    } else {
      await updateData(table, keys, data);
    }
    exportToJson(table, guildId);
  } catch (error) {
    console.error('There was an error setting Data for the Embed:', error);
  }
}

module.exports = { 
  setGeneratedEmbed: (guildId, channel, message, data) => setEmbed('GeneratedEmbeds', guildId, channel, message, data),
  getGeneratedEmbed: (guildId, message) => getOrDeleteEmbed('GeneratedEmbeds', 'get', guildId, message),
  deleteGeneratedEmbed: (guildId, message) => getOrDeleteEmbed('GeneratedEmbeds', 'delete', guildId, message),
  setEventEmbed: (guildId, channel, type, data) => setEmbed('EventEmbeds', guildId, channel, type, data),
  getEventEmbed: (guildId, type) => getOrDeleteEmbed('EventEmbeds', 'get', guildId, type),
  deleteEventEmbed: (guildId, type) => getOrDeleteEmbed('EventEmbeds', 'delete', guildId, type)
 };