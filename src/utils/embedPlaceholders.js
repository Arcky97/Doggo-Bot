const { getLevelRoles } = require("../../database/levelSystem/setLevelSettings");
const { getUserLevel } = require("../../database/levelSystem/setLevelSystem");
const calculateXpByLevel = require("./levels/calculateXpByLevel");


module.exports = async (text, input, userInfo) => {
  if (text === undefined) return null;
  const guild = input.guild;
  const userLevelInfo = userInfo ? userInfo : await getUserLevel(guild.id, input.user.id);
  const user = input.user ? input.user : input.author;
  const levelRoles = await getLevelRoles(guild.id);
  const reward = levelRoles.find(data => data.level === userLevelInfo.level) || 'no reward';
  let rewardName = 'no reward';
  if (reward !== 'no reward') {
    const rewardRole = guild.roles.cache.get(reward.roleId);
    rewardName = rewardRole.name;
  }
  const roleCount = levelRoles.findIndex(data => data.level === userLevelInfo.level) + 1 || 'no rewards';
  const roleTotal = levelRoles.length || 'no rewards set';
  const previousReward = levelRoles.filter(data => data.level < userLevelInfo.level);
  const nextReward = levelRoles.filter(data => data.level > userLevelInfo.level);
  const replacements = {
    '{user id}': user.id,
    '{user mention}': `<@${user.id}>`,
    '{user name}': user.username,
    '{user global}': user.globalName,
    '{user nick}': input.member.nickname,
    '{user avatar}': user.avatarURL(),
    '{new line}': '\n',
    '{user xp}': userLevelInfo.xp,
    '{user color}': userLevelInfo.color || '#f97316',
    '{level}': userLevelInfo.level,
    '{level previous}': userLevelInfo.level -1,
    '{level previous xp}': calculateXpByLevel(userLevelInfo.level - 1),
    '{level next}': userLevelInfo.level + 1,
    '{level next xp}': calculateXpByLevel(userLevelInfo.level + 1),
    '{reward}': reward !== 'no reward' ? `<@&${reward.roleId}>` : reward,
    '{reward role name}': rewardName,
    '{reward rolecount}': roleCount,
    '{reward rolecount progress}': roleTotal !== 'no rewards set' ? `${roleCount}/${roleTotal}` : roleTotal,
    '{reward previous}': previousReward.length > 0 ? `<@&${previousReward[previousReward.length - 1].roleId}>` : 'no previous rewards',
    '{reward next}': nextReward.length > 0 ? `<@&${nextReward[0].roleId}>` : 'no next rewards',
    '{server id}': guild.id,
    '{server name}': guild.name,    
    '{server member count}': guild.memberCount,
    '{server icon}': guild.iconURL(),
  };
  return text.replace(/\{[^}]+\}/g, match => {
    return replacements[match] || match;
  });
}