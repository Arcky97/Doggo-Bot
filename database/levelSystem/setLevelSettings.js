const { selectData } = require("../controlData/selectData");
const { insertData } = require("../controlData/insertData");
const { updateData } = require("../controlData/updateData");
const { deleteData } = require("../controlData/deleteData");
const exportToJson = require("../../src/handlers/exportToJson");

async function getLevelSettings(id) {
  try {
    let data = await selectData('LevelSettings', { guildId: id });
    if (!data) {
      await insertData('LevelSettings', { guildId: id });
      data = await selectData('LevelSettings', { guildId: id });
      exportToJson('LevelSettings', id);
    }
    return data;
  } catch (error) {
    console.error('Error fetching LevelSettings:', error);
    return [];
  }
}

async function getRoleOrChannelMultipliers({id, type}) {
  const data = await getLevelSettings(id);
  if (type === 'role') {
    return JSON.parse(data.roleMultipliers);
  } else if (type === 'channel') {
    return JSON.parse(data.channelMultipliers);
  } else if (type === 'category') {
    return JSON.parse(data.categoryMultipliers);
  }
}

async function getMultiplierReplace(id) {
  const data = await getLevelSettings(id);
  return JSON.parse(data.multiplierReplace);
}

async function getRoleOrChannelBlacklist({id, type}) {
  const data = await getLevelSettings(id);
  if (type === 'role') {
    return JSON.parse(data.blackListRoles);
  } else if (type === 'channel') {
    return JSON.parse(data.blackListChannels);
  } else if (type === 'category') {
    return JSON.parse(data.blackListCategories);
  }
}

async function getLevelRoles(id) {
  const data = await getLevelSettings(id);
  return JSON.parse(data.levelRoles);
}

async function getAnnounceChannel(id) {
  const data = await getLevelSettings(id);
  const channel = data.announceChannel;
  if (channel !== 'not set') {
    return channel;
  } else {
    return null;
  }
}

async function getXpCoolDown(id) {
  const data = await getLevelSettings(id);
  return data.xpCooldown;
}

async function getAnnouncePing(id) {
  const data = await getLevelSettings(id);
  return data.announcePing;
}

async function getAnnounceMessage(id, level) {
  const data = await getLevelSettings(id);
  let message = JSON.parse(data.announceLevelMessages).find(mes => mes.lv === level);
  if (!message) {
    message = JSON.parse(data.announceDefaultMessage);
  }
  return message;
}

async function getRoleReplace(id) {
  const data = await getLevelSettings(id);
  return data.roleReplace;
}

async function getXpSettings(id) {
  let data = await getLevelSettings(id);
  return JSON.parse(data.xpSettings);
}

async function setLevelSettings({ id, setting}) {
  let levSettings = await getLevelSettings(id);
  if (!setting) return;
  const settingKey = Object.keys(setting)[0];
  const settingValue = Object.values(setting)[0];
  let existingValue = levSettings[settingKey];
  if (typeof existingValue === 'string' && !settingKey.includes('Channel') && settingKey !== 'xpType') {
    existingValue = JSON.parse(existingValue);
  } else if (typeof existingValue === 'number' && !settingKey.includes('Multiplier') && !settingKey.includes('Cooldown')) {
    existingValue = existingValue === 1;
  }
  try {
    if (settingValue !== existingValue) {
      await updateData('LevelSettings', { guildId: id}, setting);
    } else {
      return;
    }
  } catch (error) {
    console.log('Error setting level settings', error);
  }
  exportToJson('LevelSettings', id);
}

async function resetLevelSettings(id) {
  try {
    await deleteData('LevelSettings', {guildId: id});
  } catch (error) {
    console.error('Failed to reset LevelSettings', error);
  }
  exportToJson('LevelSettings', id);
}

module.exports = { 
  setLevelSettings, 
  getLevelSettings, 
  getRoleOrChannelMultipliers, 
  getMultiplierReplace,
  getRoleOrChannelBlacklist, 
  getLevelRoles, 
  getAnnounceChannel, 
  getAnnounceMessage, 
  getXpCoolDown, 
  getAnnouncePing, 
  getRoleReplace, 
  getXpSettings,
  resetLevelSettings 
};