import { PermissionsBitField } from 'discord.js';

/**
 * Checks if a member has the required permissions.
 * @param {GuildMember} member - The member to check permissions for.
 * @param {TextChannel | null} channel - The channel context for the permissions. (optional) 
 * @param {Array<String>} requiredPermissions - An array of PermissionFlagsBits to check against.
 * @returns {Object} - An object containing `hasAll` (boolean) and `missingPermissions` (array).
 */
export default (member, channel, requiredPermissions) => {
  const permissions = channel
    ? channel.permissionsFor(member)
    : member.permissions;

  if (!permissions) {
    return { hasAll: false, missingPermissions: requiredPermissions };
  }

  const missingPermissions = requiredPermissions.filter(
    perm => !permissions.has(perm)
  );

  return {
    hasAll: missingPermissions.length === 0,
    array: missingPermissions
  };
}