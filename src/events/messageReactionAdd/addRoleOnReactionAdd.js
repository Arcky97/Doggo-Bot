const { Events } = require('discord.js');
const { getReactionRoles } = require('../../../database/controlData/reactionRoles/setReactionRoles');

module.exports = async (client, reaction, user) => {
  const guild = reaction.message.guild;
  const guildId = reaction.message.guildId;
  const channelId = reaction.message.channelId;
  const messageId = reaction.message.id;
  
  const reactionRolesData = await getReactionRoles(guildId, channelId, messageId);
  if (!reactionRolesData) return;

  const emojiRolePairs = JSON.parse(reactionRolesData.emojiRolePairs);

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the reaction:', error);
      return;
    }
  }

  // Handle custom and standard emojis
  const emojiName = reaction.emoji.name;
  const emojiId = reaction.emoji.id;
  
  const matchedPair = emojiRolePairs.find(pair => {
    // Match on custom emoji ID or standard emoji name
    return (emojiId && pair.emoji.includes(emojiId)) || (!emojiId && pair.emoji.includes(emojiName));
  });

  if (!matchedPair) {
    console.log('No matching emoji-role pair found.');
    return;
  }

  const roleId = matchedPair.roleId.replace(/<@&|>/g, '').trim();
  const role = guild.roles.cache.get(roleId);

  if (!role) {
    console.log('Role not found in the guild.');
    return;
  }

  const member = await guild.members.fetch(user.id);

  try {
    await member.roles.add(role);
    console.log(`Assigned role ${role.name} to ${user.tag}.`);
  } catch (error) {
    console.error('Failed to assign role:', error);
  }
}