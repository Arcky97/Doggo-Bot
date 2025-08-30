import { deleteData } from "../services/database/deleteData.js";
import { insertData } from "../services/database/insertData.js";
import { selectData } from "../services/database/selectData.js";
import { updateData } from "../services/database/updateData.js";

const getUniq = (table, messageOrType) => {
  return table === 'GeneratedEmbeds' ? { messageId: messageOrType, channelId: channel } : { type: messageOrType }
}

async function setEmbed(table, guildId, channel, messageOrType, data) {
  const keys = {
    guildId: guildId,
    ...getUniq(table, messageOrType, channel)
  };
  console.log(keys);
  if (typeof data.author !== 'string') data.author = JSON.stringify(data.author);
  if (typeof data.footer !== 'string') data.footer = JSON.stringify(data.footer);
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
  } catch (error) {
    console.error('There was an error setting Data for the Embed:', error);
  }
}

export function setGeneratedEmbed (guildId, channel, message, data) {
  return setEmbed('GeneratedEmbeds', guildId, channel, message, data)
}

export function getGeneratedEmbed (guildId, message) {
  return getOrDeleteEmbed('GeneratedEmbeds', 'get', guildId, message)
}

export function deleteGeneratedEmbed (guildId, message) {
  return getOrDeleteEmbed('GeneratedEmbeds', 'delete', guildId, message)
}
  
export function setEventEmbed (guildId, channel, type, data) {
  return setEmbed('EventEmbeds', guildId, channel, type, data)
}
  
export function getEventEmbed (guildId, type) {
  return getOrDeleteEmbed('EventEmbeds', 'get', guildId, type)
}
  
export function deleteEventEmbed (guildId, type) {
  return getOrDeleteEmbed('EventEmbeds', 'delete', guildId, type)
}