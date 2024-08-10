const { selectData } = require("../controlData/selectData.js");
const { insertData } = require("../controlData/insertData.js");
const { updateData } = require("../controlData/updateData.js");
const { deleteData } = require("../controlData/deleteData.js");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson.js");

const getSetting = ((setting) => {
  const columnMapping = {
    'botchat': 'chattingChannel',
    'message logging': 'messageLogging',
    'member logging': 'memberLogging',
    'server logging': 'serverLogging',
    'voice logging': 'voiceLogging',
    'join-leave logging': 'joinLeaveLogging'
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
  let message;
  try {
    if (dataExist[column]) {
      console.log("The data exist so we either delete or update.");
      if (dataExist[column] === data[column]) {
        console.log("The data is the same with what's already present, so we delete.")
        await deleteData('GuildSettings', key, data);
        message = `The channel for ${settingName} has been resetted!`;
      } else {
        console.log("The data is not the same with what's already present, so we update.")
        await updateData('GuildSettings', key, data);
        message = `The channel for ${settingName} has been updated to <#${channelId}> successfully!`;
      }
    } else {
      console.log("The data doesn't exist so we insert.")
      await insertData('GuildSettings', key, data);
      message = `The channel for ${settingName} has been set to <#${channelId}> successfully!`;
    }
    exportToJson('GuildSettings');
    return message;
  } catch (error) {
    console.error('Error setting channel:', error);
    return 'There was an error setting the channel. Please try again later.';
  }
}

module.exports = { setGuildSettings, getSetting };