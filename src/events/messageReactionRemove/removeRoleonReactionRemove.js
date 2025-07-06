import { getReactionRoles } from '../../managers/reactionRolesManager.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (reaction, user) => {
  const guild = reaction.message.guild;
  const guildId = reaction.message.guildId;
  const channelId = reaction.message.channelId;
  const messageId = reaction.message.id;
  
  try {
    await setBotStats(guildId, 'event', { event: 'messageReactionRemove' });

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
      return;
    }

    const roleId = matchedPair.roleId.replace(/<@&|>/g, '').trim();
    const role = guild.roles.cache.get(roleId);

    if (!role) {
      return;
    }

    const member = await guild.members.fetch(user.id);

    try {
      await member.roles.remove(role);
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  } catch (error) {
    
  }

}