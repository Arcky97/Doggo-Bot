const { selectData } = require("../controlData/selectData");
const { insertData } = require("../controlData/insertData");
const { updateData } = require("../controlData/updateData");
const { deleteData } = require("../controlData/deleteData");
const { query } = require("../db");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

const convertSetupCommand = ((setting) => {
  const columnMapping = {
    'bot-chat': 'chattingChannel',
    'message-logging': 'messageLogging',
    'member-logging': 'memberLogging',
    'server-logging': 'serverLogging',
    'voice-logging': 'voiceLogging',
    'join-leave-logging': 'joinLeaveLogging'
  };

  const column = columnMapping[setting];

  if (!column) {
    console.error('Invalid setting name:', setting);
    return null;
  } else {
    return column;
  }
})

async function getGuildSettings(guildId) {
  try {
    const guildSetting = await selectData('GuildSettings', { guildId: guildId });
    return guildSetting
  } catch (error) {
    console.error('Error fetching guildSettings:', error);
    return [];
  }
}

async function setGuildSettings(guildId, settingName, channelId) {
  const column = convertSetupCommand(settingName);
  if (!column) return;

  const key = {
    guildId: guildId
  }

  const data = {
    [column]: channelId
  }
  console.log(data);

  try {
    const dataExist = await selectData('GuildSettings', key)
    let message;
    try {
      if (dataExist) {
        if (dataExist[column] === data[column]) {
          await deleteData('GuildSettings', key, data);
          message = `The channel for ${settingName} has been resetted!`;
        } else {
          await updateData('GuildSettings', key, data);
          message = `The channel for ${settingName} has been updated to <#${channelId}> successfully!`;
        }
      } else {
        await insertData('GuildSettings', key, data);
        message = `The channel for ${settingName} has been set to <#${channelId}> successfully!`;
      }
      exportToJson('GuildSettings');
      return message;
    } catch (error) {
      console.error('Error setting channel:', error);
      return 'There was an error setting the channel. Please try again later.';
    }
  } catch (error) {
    console.error('Error getting setted channel:', error);
    return `There was an error getting the Guild Settings. Please try again later.`;
  }
}

module.exports = { setGuildSettings, getGuildSettings, convertSetupCommand };