const { devs } = require('../../config.json');

const adminPerms = [
  "ManageChannels",
  "ManageRoles",
  "ManageGuildExpressions",
  "KickMembers",
  "BanMembers",
  "ManageGuild",
  "ViewAuditLog",
  "ManageWebhooks",
  "ManageMessages",
  "ManageThreads",
  "ModerateMembers",
  "ManageEvents",
  "ManageNicknames",
  "Administrator"
]

module.exports = (input) => {
  let output = [];
  for (const { member, perms } of input) {
    if (!member) continue;
    let type;
    if (devs.includes(member.id)) {
      type = 'dev';
    } else if (member.id === client.user.id) {
      type = 'client';
    } else if (member.user.bot) {
      type = 'bot';
    } else if (member.id === member.guild.ownerId) {
      type = 'owner';
    } else if ((perms && perms.some(perm => member.permissions.has(perm))) || adminPerms.some(perm => member.permissions.has(perm))) {
      type = 'admin';
    } else {
      type = 'default';
    }
    output.push(type);
  }
  return output;
}