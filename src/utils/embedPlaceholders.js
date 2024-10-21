const { getUserLevel } = require("../../database/levelSystem/setLevelSystem");
const calculateLevelXp = require("./levels/calculateLevelXp");

module.exports = async (text, input) => {
  const guild = input.guild;
  const userLevelInfo = await getUserLevel(guild.id, input.user.id);
  const replacements = {
    '{user id}': input.user.id,
    '{user mention}': `<@${input.user.id}>`,
    '{user name}': input.user.username,
    '{user globalName}': input.user.globalName,
    '{user nick}': input.member.nickname,
    '{user avatar}': input.user.avatarURL(),
    '{new line}': '\n',
    '{user exp}': userLevelInfo.xp,
    '{user color}': userLevelInfo.color,
    '{level}': userLevelInfo.level,
    '{level previous}': userLevelInfo.level -1,
    '{level previous xp}': calculateLevelXp(userLevelInfo.level - 1),
    '{level next}': userLevelInfo + 1,
    '{level next xp}': calculateLevelXp(userLevelInfo.level + 1),
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