import { getLevelRoles, getRoleReplace } from "../../managers/levelSettingsManager.js";

export default async (guildId, member, userInfo) => {
  const levelRoles = await getLevelRoles(guildId);
  if (levelRoles.length === 0) return;
  const replaceRoles = await getRoleReplace(guildId) === 1;
  const roleToAdd = levelRoles.find(data => data.level === userInfo.level);
  if (roleToAdd === null || roleToAdd === undefined) return;
  member.roles.add(roleToAdd.roleId);
  if (replaceRoles) {
    const rolesToRemove = levelRoles.filter(data => data.level < userInfo.level);
    rolesToRemove.forEach(data => {
      member.roles.remove(data.roleId)
    });
  }
}