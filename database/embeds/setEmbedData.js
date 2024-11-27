const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

const getUniq = (table, messageOrType) => {
  return table === 'GeneratedEmbeds' ? { messageId: messageOrType } : { type: messageOrType }
}

async function setEmbed(table, guild, channel, messageOrType, data) {
  const keys = {
    guildId: guild,
    channelId: channel,
    ...getUniq(table, messageOrType)
  };
  await setEmbedData(table, keys, data);
}

async function getOrDeleteEmbed(table, action, guild, messageOrType) {
  const keys = {
    guildId: guild,
    ...getUniq(table, messageOrType) 
  };
  if (action === 'get') {
    return await selectData(table, keys);
  } else {
    await deleteData(table, keys);
    exportToJson(table);
  }
}

async function setEmbedData(table, keys, data) {
  const dataExist = await selectData(table, keys);
  try {
    if (!dataExist) {
      await insertData(table, keys, data);
    } else {
      await updateData(table, keys, data);
    }
    exportToJson(table);
  } catch (error) {
    console.error('There was an error setting Data for the Embed:', error);
  }
}

module.exports = { 
  setGeneratedEmbed: (guild, channel, message, data) => setEmbed('GeneratedEmbeds', guild, channel, message, data),
  getGeneratedEmbed: (guild, message) => getOrDeleteEmbed('GeneratedEmbeds', 'get', guild, message),
  deleteGeneratedEmbed: (guild, message) => getOrDeleteEmbed('GeneratedEmbeds', 'delete', guild, message),
  setEventEmbed: (guild, channel, type, data) => setEmbed('EventEmbeds', guild, channel, type, data),
  getEventEmbed: (guild, type) => getOrDeleteEmbed('EventEmbeds', 'get', guild, type),
  deleteEventEmbed: (guild, type) => getOrDeleteEmbed('EventEmbeds', 'delete', guild, type)
 };