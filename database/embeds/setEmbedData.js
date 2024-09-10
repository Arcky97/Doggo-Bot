const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

async function getGeneratedEmbed(guild, message) {
  return await selectData('GeneratedEmbeds', { guildId: guild, messageId: message }) 
}

async function setEventEmbed(guild, channel, type, data) {
  const keys = {
    guildId: guild,
    channelId: channel,
    type: type
  };
  setEmbedData('EventEmbeds', keys, data);
}

async function setGeneratedEmbed(guildId, channelId, messageId, data) {
  const keys = {
    guildId: guildId,
    channelId: channelId,
    messageId: messageId
  };
  setEmbedData('GeneratedEmbeds', keys, data);
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
    console.log('There was an error setting Data for the Embed:', error);
  }
}

module.exports = { setEventEmbed, setGeneratedEmbed, getGeneratedEmbed };