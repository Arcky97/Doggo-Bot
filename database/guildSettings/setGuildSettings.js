const { selectData } = require("../controlData/selectData");
const { setData } = require("../controlData/setData");

const getSetting = ((setting) => {
  const columnMapping = {
    'botchat': 'chattingChannel',
    'message-logging': 'messageLogging',
    'member-logging': 'memberLogging',
    'server-logging': 'serverLogging',
    'voice-logging': 'voiceLogging',
    'joinleave-logging': 'joinLeaveLogging'
  };

  const column = columnMapping[setting];

  if (!column) {
    console.error('Invalid setting name:', setting);
    return null;
  } else {
    return column;
  }
})  

async function setGuildSettings(guildId, settingName, channelId) {
  const column = getSetting(settingName);
  if (!column) return;

  const data = {
    guildId: guildId,
    [column]: channelId
  }

  console.log(data)
  const dataExist = await selectData('GuildSettings', data, ['guildId'])
  let action;
  if (dataExist) {
    if (dataExist[settingName] === data[settingName]) {
      action = "delete";
    } else {
      action = "update";
    }
  } else {
    action = "insert";
  }
  await setData('GuildSettings', data, action);
  try {
    switch(action) {
      case "insert":
        return `The channel for ${settingName} has been set to <#${channelId} successfully!>`;
      case "update":
        return `The channel for ${settingName} has been updated to <#${channelId} successfully!`;
      case "delete":
        return `The channel for ${settingName} has been resetted!`;
      }
  } catch (error) {
    console.error('Error setting channel:', error);
    return 'There was an error setting the channel. Please try again later.';
  }
}

module.exports = { setGuildSettings, getSetting };