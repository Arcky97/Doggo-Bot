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
    'moderation': 'moderationLogging',
    'report': 'reportLogging',
    'ignore': 'ignoreLogging',
    'mute-role': 'muteRole',
    'join-role': 'joinRoles'
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

async function getJoinRoles(guildId) {
  try {
    const data = await getGuildSettings(guildId);
    return JSON.parse(data.joinRoles);
  } catch (error) {
    console.error('Error fetching join roles data from guildSettings:', error);
  }
}
async function setGuildSettings(guildId, settingName, value) {
  const column = convertSetupCommand(settingName);
  if (!column) return;

  const key = {
    guildId: guildId
  }

  let data, action, setData;

  if (settingName !== 'ignore' && settingName !== 'join-role') {
    data = {
      [column]: value.id
    }
  } else {
    let existingData, type;
    if (settingName === 'ignore') {
      existingData = await getIgnoreLoggingChannels(guildId);
      type = 'channel';
    } else {
      existingData = await getJoinRoles(guildId);
      type = 'role';
    }
    [action, setData] = setChannelOrRoleArray({ type: type, data: existingData, id: value.id});
    data = {
      [column]: setData
    }
  }

  try {
    const dataExist = await selectData('GuildSettings', key)
    let title, descr;
    settingName = firstLetterToUpperCase(settingName);
    try {
      if (dataExist[column] && settingName !== 'Ignore' && settingName !== 'Join-role') {
        if (dataExist[column] === data[column]) {
          await deleteData('GuildSettings', key, data);
          if (settingName !== 'Mute-role') {
            title = `${settingName} Logging Resetted!`;
            descr = `The channel for **${settingName} Logging** has been resetted!`;
          } else {
            title= `Mute Role Removed!`;
            descr = `The Mute Role has been removed.`;
          }
        } else {
          await updateData('GuildSettings', key, data);
          if (settingName !== 'Mute-role') {
            title = `${settingName} Logging Updated!`;
            descr = `The channel for **${settingName} Logging** has been updated to ${value}!`;
          } else {
            title = `Mute Role Updated!`;
            descr = `The Mute Role has been updated to ${value}`;
          }
        }
      } else {
        if (settingName !== 'Ignore' && settingName !== 'Join-role') {
          if (dataExist) {
            await updateData('GuildSettings', key, data);
          } else {
            await insertData('GuildSettings', key, data);
          }
          if (settingName !== 'Mute-role') {
            title = `${settingName} Logging Set!`;
            descr = `The channel for **${settingName} Logging** has been set to ${value}!`;
          } else {
            title = `Mute Role Set!`;
            descr = `The Mute Role has been set to ${value}`;
          }
        } else {
          await updateData('GuildSettings', key, data);
          if (settingName === 'ignore') {
            title = `Ignore Channel ${action}!`;
            descr = `${value} has been ${action} ${action === 'added' ? 'to' : 'from'} the **${settingName}** Logging Channel List.`;
          } else {
            title = `Join Role ${action}!`;
            descr = `${value} has been ${action} ${action === 'added' ? 'to' : 'from'} the **${settingName}** List.`;
          }
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