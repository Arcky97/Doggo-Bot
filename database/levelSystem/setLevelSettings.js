const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

const convertLevelSetting = (setting => {
  const columnMapping = {

  }
})


async function getLevelSettings(id) {
  return await selectData('LevelSettings', { guildId: id} );
}

async function getRoleOrChannelMultipliers({id, type}) {
  const data = await getLevelSettings(id);
  if (type === 'role') {
    return JSON.parse(data.roleMultipliers);
  } else if (type === 'channel') {
    return JSON.parse(data.channelMultipliers);
  };
}

async function setLevelSettings({ id, setting}) {
  let levSettings = await getLevelSettings(id);
  const settingKey = Object.keys(setting)[0];
  const settingValue = Object.values(setting)[0];
  
  let existingValue = levSettings[settingKey];

  if (typeof existingValue === 'string' && !settingKey.includes('Channel')) {
    existingValue = JSON.parse(existingValue);
  } else if (typeof existingValue === 'number' && !settingKey.includes('Multiplier') && !settingKey.includes('Cooldown')) {
    existingValue = existingValue === 1;
  }

  try {
    if (settingValue !== existingValue) {
      await updateData('LevelSettings', { guildId: id}, setting );
    } else {
      console.log('Data was not updated (it\'s the same as it was)');
      return;
    }
  } catch (error) {
    console.log('Error setting level settings', error);
  }
  exportToJson('LevelSettings');
}

module.exports = { setLevelSettings, getLevelSettings, getRoleOrChannelMultipliers };