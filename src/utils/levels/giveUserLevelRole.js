const { getLevelRoles, getRoleReplace } = require("../../../database/levelSystem/setLevelSettings");
const getMemberRoles = require("../getMemberRoles");

module.exports = async (guildId, member, userInfo) => {
  const levelRoles = await getLevelRoles(guildId);
  if (levelRoles.length === 0) return;
  const userRoles = getMemberRoles(member);
  const replaceRoles = await getRoleReplace(guildId) === 1;
  const roleToAdd = levelRoles.find(data => data.level === userInfo.level);
  console.log(roleToAdd);
  if (roleToAdd === null) return;
  member.roles.add(roleToAdd.roleId);
  if (replaceRoles) {
    /*const rolesToRemove = levelRoles.find(data => data.level < userInfo.level);
    rolesToRemove.forEach(data => {
      member.roles.remove(data.roleId)
    });*/
  }
}