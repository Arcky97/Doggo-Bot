const { Client, User } = require('discord.js');
const getMemberRoles = require('../../utils/getMemberRoles');

module.exports = async (client, oldUser, newUser) => {
  try {
    const oldUserName = oldUser.username;
    const newUserName = newUser.username;
    const oldGlobalName = oldUser.globalName;
    const newGlobalName = newUser.globalName;
    const oldUserIcon = oldUser.avatarURL();
    const newUserIcon = newUser.avatarURL();

    console.log(`${oldUser.username} updated their profile!`);
  } catch (error) {
    console.error('Failed to log Member update!', error)
  }
}