module.exports = (text, guild, input) => {
  const userMention = `<@${input.user.id}>`;
  const userName = input.user.name;
  const userNick = input.user.nickName;
  const newLine = '\n';
  const memberCount = guild.memberCount;
  const serverName = guild.name;

  const replacements = {
    '{user mention}': userMention,
    '{user name}': userName,
    '{user nick}': userNick,
    '{new line}': newLine,
    '{member count}': memberCount,
    '{server name}': serverName
  };

  return text.replace(/\{[^}]+\}/g, match => {
    return replacements[match] || match;
  });
}