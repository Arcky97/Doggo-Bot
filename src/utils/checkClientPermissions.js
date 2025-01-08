module.exports = (channel, reqPerms) => {
  const perms = channel.permissionsFor(client.user);
  console.log(`This channel gives Doggo Bot folowing permissions:`, perms);
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