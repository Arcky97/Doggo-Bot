const { Events } = require('discord.js');
const { getReactionRoles } = require('../../../database/reactionRoles/setReactionRoles');

module.exports = async (reaction, user) => {
  const guild = reaction.message.guild;
  const guildId = reaction.message.guildId;
  const channelId = reaction.message.channelId;
  const messageId = reaction.message.id;
  
  const reactionRolesData = await getReactionRoles(guildId, channelId, messageId);
  if (!reactionRolesData) return;

  const roleLimit = reactionRolesData.maxRoles;
  const reactionLimit = reactionRolesData.maxReactions;
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
    return;
  }

  const roleId = matchedPair.roleId.replace(/<@&|>/g, '').trim();
  const role = guild.roles.cache.get(roleId);

  if (!role) {
    return;
  }

  const member = guild.members.cache.get(user.id);

  if (reactionLimit > 0) {
    const memberRoles = emojiRolePairs
    .map(pair => pair.roleId.replace(/<@&|>/g, '').trim())
    .filter(rId => member.roles.cache.has(rId));

    if (memberRoles.length >= reactionLimit) {
      const roleToRemoveId = memberRoles[0];
      const roleToRemove = guild.roles.cache.get(roleToRemoveId);
      const emojiToRemove = emojiRolePairs.find(pair => pair.roleId.includes(roleToRemoveId)).emoji;

      try {
        await member.roles.remove(roleToRemove);

        const reactionToRemove = reaction.message.reactions.cache.find(r => r.emoji.name === emojiToRemove || r.emoji.id === emojiToRemove);

        if (reactionToRemove) {
          await reactionToRemove.users.remove(user.id);
        }

      } catch (error) {
        console.error('Failed to remove role:', error);
        return;
      }
    }
  }
  
  if (roleLimit > 0) {
    const roleMemberCount = role.members.size;
    if (roleMemberCount >= roleLimit) {
      try {
        const reactionToRemove = reaction.message.reactions.cache.find(r => r.emoji.name === emojiName || r.emoji.id === emojiId);
        if (reactionToRemove) {
          await reactionToRemove.users.remove(user.id);
        }
        return;
      } catch (error) {
        console.error('Failed to remove reaction:', error);
      }
    }
  }

  try {
    await member.roles.add(role);
  } catch (error) {
    console.error('Failed to assign role:', error);
  }
}