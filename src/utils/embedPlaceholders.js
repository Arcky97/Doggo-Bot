const { getUserLevel } = require("../../database/levelSystem/setLevelSystem");
const calculateXpByLevel = require("./levels/calculateXpByLevel");

module.exports = async (text, input, userInfo) => {
  if (text === undefined) return null;
  const guild = input.guild;
  const userLevelInfo = userInfo ? userInfo : await getUserLevel(guild.id, input.user.id);
  const user = input.user ? input.user : input.author;
  const replacements = {
    '{user id}': user.id,
    '{user mention}': `<@${user.id}>`,
    '{user name}': user.username,
    '{user global}': user.globalName,
    '{user nick}': input.member.nickname,
    '{user avatar}': user.avatarURL(),
    '{new line}': '\n',
    '{user exp}': userLevelInfo.xp,
    '{user color}': userLevelInfo.color,
    '{level}': userLevelInfo.level,
    '{level previous}': userLevelInfo.level -1,
    '{level previous xp}': calculateXpByLevel(userLevelInfo.level - 1),
    '{level next}': userLevelInfo + 1,
    '{level next xp}': calculateXpByLevel(userLevelInfo.level + 1),
    '{reward}': 'n.a.y.',
    '{reward role name}': 'n.a.y.',
    '{reward rolecount}': 'n.a.y.',
    '{reward rolecount progress}': 'n.a.y.',
    '{reward previous}': 'n.a.y.',
    '{reward next}': 'n.a.y.',
    '{server id}': guild.id,
    '{server name}': guild.name,    
    '{server member count}': guild.memberCount,
    '{server icon}': guild.iconURL(),
  };
  return text.replace(/\{[^}]+\}/g, match => {
    return replacements[match] || match;
  });
}