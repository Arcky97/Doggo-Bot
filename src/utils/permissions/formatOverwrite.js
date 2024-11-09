const { PermissionsBitField } = require("discord.js");

module.exports = (overwrite, action) => {
  const type = overwrite.type === 0 ? 'Role' : 'Member';
  const permissions = [];

  if (overwrite.allow.bitfield !== 0n ) {
    permissions.push(`Allowed: ${new PermissionsBitField(overwrite.allow.bitfield).toArray().join(', ')}`);
  }

  if (overwrite.deny.bitfield !== 0n) {
    permissions.push(`Denied: ${new PermissionsBitField(overwrite.deny.bitfield).toArray().join(', ')}`);
  }

  return `**${action} ${type}** <@&${overwrite.id}>\n${permissions.join('\n')}`;
}