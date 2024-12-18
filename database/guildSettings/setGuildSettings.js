const { selectData } = require("../controlData/selectData");
const { insertData } = require("../controlData/insertData");
const { updateData } = require("../controlData/updateData");
const { deleteData } = require("../controlData/deleteData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");
const firstLetterToUpperCase = require("../../src/utils/firstLetterToUpperCase");
const { setChannelOrRoleArray } = require("../../src/utils/setArrayValues");

const convertSetupCommand = (setting => {
  const columnMapping = {
    'bot-chat': 'chattingChannel',
    'message': 'messageLogging',
    'member': 'memberLogging',
    'server': 'serverLogging',
    'voice': 'voiceLogging',
    'join-leave': 'joinLeaveLogging',
    'report': 'reportLogging',
    'ignore': 'ignoreLogging',
    'mute-role': 'muteRole',
    'join-role': 'joinRole'
  };

  const column = columnMapping[setting];

  if (column) {
    return column;
  } else {
    console.error('Invalid setting name:', setting);
    return null;
  }
})

async function getGuildLoggingConfig(guildId, type) {
  try {
    const data = await getGuildSettings(guildId);
    return JSON.parse(data[`${type}Config`]);
  } catch (error) {
    console.error('Error fetching GuildLoggingConfig:', error);
    return [];
  }
}

async function setGuildLoggingConfig(guildId, type, data) {
  try {
    await updateData('GuildSettings', {guildId: guildId}, { [`${type}Config`]: JSON.stringify(data) });
  } catch (error) {
    console.error('Error Updating Guild Logging Config data:', error);
  }
  exportToJson('GuildSettings');
}

async function getGuildSettings(guildId) {
  try {
    let data = await selectData('GuildSettings', { guildId: guildId })
    if (!data) {
      await insertData('GuildSettings', { guildId: guildId });
      data = await selectData('GuildSettings', { guildId: guildId });
      exportToJson('GuildSettings');
    }
    return data;
  } catch (error) {
    console.error('Error fetching guildSettings:', error);
    return [];
  }
}

async function getIgnoreLoggingChannels(guildId) {
  try {
    const data = await getGuildSettings(guildId);
    return JSON.parse(data.ignoreLogging);
  } catch (error) {
    console.error('Error fetching ignore Logging data from guildSettings:', error);
    return [];
  }
}

async function setGuildSettings(guildId, settingName, value) {
  const column = convertSetupCommand(settingName);
  if (!column) return;

  const key = {
    guildId: guildId
  }

  let data, action, setData;

  if (settingName !== 'ignore') {
    data = {
      [column]: value.id
    }
  } else {
    const existingData = await getIgnoreLoggingChannels(guildId);
    [action, setData] = setChannelOrRoleArray({ type: 'channel', data: existingData, id: value.id });
    data = {
      [column]: setData
    }
  }

  try {
    const dataExist = await selectData('GuildSettings', key)
    let title, descr;
    settingName = firstLetterToUpperCase(settingName);
    try {
      if (dataExist[column] && settingName !== 'Ignore') {
        if (dataExist[column] === data[column]) {
          await deleteData('GuildSettings', key, data);
          if (settingName !== 'Mute-role' && settingName !== 'Join-role') {
            title = `${settingName} Logging Resetted!`;
            descr = `The channel for **${settingName} Logging** has been resetted!`;
          } else {
            const name = settingName === 'Mute-role' ? 'Mute' : 'Join';
            title= `${name} Role Removed!`;
            descr = `The ${name} Role has been removed.`;
          }
        } else {
          await updateData('GuildSettings', key, data);
          if (settingName !== 'Mute-role' && settingName !== 'Join-role') {
            title = `${settingName} Logging Updated!`;
            descr = `The channel for **${settingName} Logging** has been updated to ${value}!`;
          } else {
            const name = settingName === 'Mute-role' ? 'Mute' : 'Join';
            title = `${name} Role Updated!`;
            descr = `The ${name} Role has been updated to ${value}`;
          }
        }
      } else {
        if (settingName !== 'Ignore') {
          if (dataExist) {
            await updateData('GuildSettings', key, data);
          } else {
            await insertData('GuildSettings', key, data);
          }
          if (settingName !== 'Mute-role' && settingName !== 'Join-role') {
            title = `${settingName} Logging Set!`;
            descr = `The channel for **${settingName} Logging** has been set to ${value}!`;
          } else {
            const name = settingName === 'Mute-role' ? 'Mute' : 'Join';
            title = `${name} Role Set!`;
            descr = `The ${name} Role has been set to ${value}`;
          }
        } else {
          await updateData('GuildSettings', key, data);
          title = `Ignore Channel ${action}!`;
          descr = `${value} has been ${action} ${action === 'added' ? 'to' : 'from'} the **${settingName}** Logging Channel List.`;
        }        
      }
      exportToJson('GuildSettings');
      return [title, descr];
    } catch (error) {
      console.error('Error setting channel:', error);
      return 'There was an error setting the channel. Please try again later.';
    }
  } catch (error) {
    console.error('Error getting setted channel:', error);
    return `There was an error getting the Guild Settings. Please try again later.`;
  }
}

async function resetGuildSettings(id) {
  try {
    await deleteData('GuildSettings', {guildId: id});
  } catch (error) {
    console.error(`Failed to reset Guild Settings for guild ${id}`, error);
  }
}

module.exports = { setGuildSettings, getGuildSettings, convertSetupCommand, resetGuildSettings, getIgnoreLoggingChannels, getGuildLoggingConfig, setGuildLoggingConfig };