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

  const key = {
    guildId: guildId
  }

  const data = {
    [column]: channelId
  }

  console.log("Let's check if the data already exists in the database table.");
  const dataExist = await selectData('GuildSettings', key)
  let action;
  if (dataExist) {
    console.log("The data exist so we either delete or update.");
    if (dataExist[column] === data[column]) {
      console.log("The data is the same with what's already present, so we delete.")
      action = "delete";
    } else {
      console.log("The data is not the same with what's already present, so we update.")
      action = "update";
    }
  } else {
    console.log("The data doesn't exist so we insert.")
    action = "insert";
  }
  console.log("we call setData and pass the table name, data and action.")
  try {
    await setData('GuildSettings', key, data, action);
    switch(action) {
      case "insert":
        return `The channel for ${settingName} has been set to <#${channelId}> successfully!>`;
      case "update":
        return `The channel for ${settingName} has been updated to <#${channelId}> successfully!`;
      case "delete":
        return `The channel for ${settingName} has been resetted!`;
      }
  } catch (error) {
    console.error('Error setting channel:', error);
    return 'There was an error setting the channel. Please try again later.';
  }
}

module.exports = { setGuildSettings, getSetting };