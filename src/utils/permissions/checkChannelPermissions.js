module.exports = async (bot, channel) => {
  const botPermissions = channel.permissionsFor(bot.user);
  const permissions = [
    'ViewChannel',
    'SendMessages',
    'EmbedLinks',
    'AttachFiles'
  ]
  if (!botPermissions) {
    console.warn(`Doggo Bot cannot view the Channel: ${channel.id} in Guild ${channel.guild.id}`);
    return false;
  }

  const missingPermissions = permissions.filter(perm => !botPermissions.has(perm));

  return missingPermissions.length === 0;
}