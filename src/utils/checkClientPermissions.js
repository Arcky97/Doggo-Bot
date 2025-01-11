const { PermissionsBitField } = require("discord.js");


module.exports = (channel, reqPerms) => {
  const perms = channel.permissionsFor(client.user);
  
  //const isPrivate = channel.permissionsFor(client.guild.id);

  //if (isPrivate) console.log('The channel is a private channel');

  if (!perms) {
    console.log('Could not retrieve permissions for this channel.');
    return false;
  }

  const missingPerms = reqPerms.filter(perm => !perms.has(perm));

  if (missingPerms.length > 0) {
    console.log(`Missing permissions: ${missingPerms.join(', ')}`);
    return missingPerms;
  } else {
    console.log('Bot has all required permissions.');
    return []
  }
};