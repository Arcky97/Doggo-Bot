import { selectData } from "../services/database/selectData.js";
import { insertData } from "../services/database/insertData.js";
import { updateData } from "../services/database/updateData.js";
import { deleteData } from "../services/database/deleteData.js";
import firstLetterToUpperCase from "../utils/firstLetterToUpperCase.js";
import { setChannelOrRoleArray } from "../utils/setArrayValues.js";

export const convertSetupCommand = (setting => {
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

export async function getGuildLoggingConfig(guildId, type) {
  try {
    const data = await getGuildSettings(guildId);
    return JSON.parse(data[`${type}Config`]);
  } catch (error) {
    console.error('Error fetching GuildLoggingConfig:', error);
    return [];
  }
}

export async function setGuildLoggingConfig(guildId, type, data) {
  try {
    await updateData('GuildSettings', {guildId: guildId}, { [`${type}Config`]: JSON.stringify(data) });
  } catch (error) {
    console.error('Error Updating Guild Logging Config data:', error);
  }
}

export async function getGuildSettings(guildId) {
  try {
    let data = await selectData('GuildSettings', { guildId: guildId });
    if (!data) {
      await insertData('GuildSettings', { guildId: guildId });
      data = await selectData('GuildSettings', { guildId: guildId });
    }
    return data;
  } catch (error) {
    console.error('Error fetching guildSettings:', error);
    return [];
  }
}

export async function getIgnoreLoggingChannels(guildId) {
  try {
    const data = await getGuildSettings(guildId);
    return JSON.parse(data.ignoreLogging);
  } catch (error) {
    console.error('Error fetching ignore Logging data from guildSettings:', error);
    return [];
  }
}

/**
 * Get the mute role for the guild.
 * @param {String} guildId - The ID of the guild. 
 * @returns {Promise<String>} - The ID of the mute role.
 */
export async function getMuteRole(guildId) {
  try {
    const data = await getGuildSettings(guildId);
    return data.muteRole;
  } catch (error) {
    console.error('Error fetching mute role data from GuildSettings:', error);
  }
}

async function getJoinRoles(guildId) {
  try {
    const data = await getGuildSettings(guildId);
    return JSON.parse(data.joinRoles);
  } catch (error) {
    console.error('Error fetching join roles data from GuildSettings:', error);
  }
}

export async function setGuildSettings(guildId, settingName, value) {
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
    [action, setData] = setChannelOrRoleArray({ type: type, data: existingData || [], id: value.id});
    data = {
      [column]: setData
    }
  }

  try {
    const dataExist = await selectData('GuildSettings', key)
    let title, descr;
    settingName = firstLetterToUpperCase(settingName);
    try {
      const logOrChan = settingName === 'Ignore' ? 'Channel' : 'Log Channel';
      if (dataExist[column] && settingName !== 'Ignore' && settingName !== 'Join-role') {
        if (dataExist[column] === data[column]) {
          await deleteData('GuildSettings', key, data);
          if (settingName !== 'Mute-role' && settingName !== 'Bot-chat') {
            title = `${settingName} ${logOrChan} Resetted!`;
            descr = `The channel for **${settingName} ${logOrChan}** has been resetted!`;
          } else if (settingName === 'Bot-chat') {
            title = 'Bot Chat Channel Resetted!';
            descr = `The Bot Chat Channel has been resetted!`;
          } else {
            title= `Mute Role Removed!`;
            descr = `The Mute Role has been removed.`;
          }
        } else {
          if (settingName !== 'Mute-role') {
            if (settingName === 'Bot-chat') {
              title = 'Bot Chat Channel Updated!';
              descr = `The Bot Chat Channel has been updated to ${value}!`;
            } else {
              title = `${settingName} ${logOrChan} Updated!`;
              descr = `The channel for **${settingName} ${logOrChan}** has been updated to ${value}!`;
            }
          } else {
            title = `Mute Role Updated!`;
            descr = `The Mute Role has been updated to ${value}`;
          }
          await updateData('GuildSettings', key, data);
        }
      } else {
        if (settingName !== 'Ignore' && settingName !== 'Join-role') {
          if (dataExist) {
            await updateData('GuildSettings', key, data);
          } else {
            await insertData('GuildSettings', key, data);
          }
          if (settingName !== 'Mute-role') {
            if (settingName === 'Bot-chat') {
              title = 'Bot Chat Channel Set!';
              descr = `The Bot Chat Channel has been set to ${value}!`;
            } else {
              title = `${settingName} ${logOrChan} Set!`;
              descr = `The channel for **${settingName} ${logOrChan}** has been set to ${value}!`;  
            }
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

export async function resetGuildSettings(id) {
  try {
    await deleteData('GuildSettings', {guildId: id});
  } catch (error) {
    console.error(`Failed to reset Guild Settings for guild ${id}`, error);
  }
}