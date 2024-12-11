const { PermissionFlagsBits } = require("discord.js");
const { devs } = require('../../config.json');

module.exports = (client, input) => {
  let output = [];
  input.forEach(i => {
    let type;
    if (devs.includes(i.user.id)) {
      type = 'dev';
    } else if (i.user.id === client.user.id) {
      type = 'client';
    } else if (i.user.bot) {
      type = 'bots'
    } else if (i.user.id === i.guild.ownerId) {
      type = 'owner';
    } else if (i.permissions.has(PermissionFlagsBits.Administrator)) {
      type = 'admin';
    } else {
      type = 'default';
    }
    output.push(type);
  });
  return output;
}