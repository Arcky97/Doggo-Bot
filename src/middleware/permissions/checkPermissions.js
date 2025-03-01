const { PermissionsBitField } = require('discord.js');
const categorizedPermissions = require('../../../data/loggingPermissions.json');

const globalPermissions = [
  'Administrator',
  'ManageRoles',
  'ManageChannels',
  'ManageGuild',
  'KickMembers',
  'BanMembers',
  'ManageWebhooks',
  'ManageGuildExpressions',
  'ViewAuditLog',
  'ModerateMembers'
];

const permissionDependencies = {
  ViewChannel: [],
  SendMessages: ['ViewChannel'],
  EmbedLinks: ['SendMessages', 'ViewChannel'],
  AttachFiles: ['SendMessages', 'ViewChannel'],
  AddReactions: ['SendMessages', 'ManageMessages'],
  UseExternalEmojis: ['SendMessages', 'ManageMessages'],
  UseExternalStickers: ['SendMessages', 'ManageMessages'],
  ManageThreads: ['ManageChannels', 'ViewChannel'],
  ManageRoles: ['ManageGuild'],
  TimeoutMembers: ['ModerateMembers'],
  KickMembers: ['ModerateMembers', 'ViewChannel'],
  BanMembers: ['ModerateMembers', 'ViewChannel'],
};

async function checkPermissions (channel, perms, member) {

  if (!member || member.guild.ownerId === member.id) return { hasAll: true, array: [] };
  // get the permissions for the user in the channel
  const memberChannelPermissions = channel.permissionsFor(member);

  // get the permissions for the user in the guild
  const memberGuildPermissions = member.permissions;

  // default permissions required
  const permissions = ['ViewChannel', 'SendMessages'];

  // add extra given permissions
  if (perms) perms.forEach(perm => permissions.push(perm));

  // Separate permissions into global and channel specific
  const globalPermsToCheck = permissions.filter(perm => globalPermissions.includes(perm));
  const channelPermsToCheck = permissions.filter(perm => !globalPermissions.includes(perm));

  // check global permissions
  const missingGlobalPerms = globalPermsToCheck.filter(perm => !memberGuildPermissions.has(PermissionsBitField.Flags[perm]));

  // check Channel permissions
  const missingChannelPerms = [];

  for (const perm of channelPermsToCheck) {
    // check the permission itself
    if (!memberChannelPermissions.has(PermissionsBitField.Flags[perm])) {
      missingChannelPerms.push(perm);
    }

    // check dependencies
    if (permissionDependencies[perm]) {
      for (const dep of permissionDependencies[perm]) {
        if (!memberChannelPermissions.has(PermissionsBitField.Flags[dep])) {
          if (!missingChannelPerms.includes(dep)) missingChannelPerms.push(dep);
        }
      }
    }
  }

  const missingPerms = [...missingGlobalPerms, ...missingChannelPerms]

  // Convert missing permissions to their display name
  const missingPermsArray = missingPerms.map(missingPerm => {
    for (const cat of Object.values(categorizedPermissions)) {
      const missingPermEl = cat.find(perm => perm[missingPerm]);
      if (missingPermEl) return missingPermEl[missingPerm];
    }
    return missingPerm;
  });

  //console.log('Missing Permissions:', missingPermsArray.join(', '));

  return {
    hasAll: missingPerms.length === 0,
    array: missingPermsArray
  }
}

module.exports = {
  checkChannelPermissions: (channel, perms) => checkPermissions(channel, perms, channel.guild.members.me),
  checkClientPermissions: (channel, perms) => checkPermissions(channel, perms, channel.guild.members.me),
  checkUserPermissions: (channel, perms, user) => checkPermissions(channel, perms, user)
}