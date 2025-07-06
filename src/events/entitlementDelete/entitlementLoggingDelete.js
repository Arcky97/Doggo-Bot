// Premium Access 
import { Client, Entitlement, EmbedBuilder } from 'discord.js';
import getEntitlementTypeName from '../../managers/logging/getEntitlementTypeName.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (entitlement) => {
  const guildId = entitlement.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'entitlementDelete' });
    
    // return if entitlement is not for client.
    if (entitlement.applicationId !== client.id) return;
    // Only Main Server 
    const logChannel = client.channels.cache.get('1305294469918101547');
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`${getEntitlementTypeName(entitlement)} Removed!`)
      .setFields(
        {
          name: `Purchased Item ID`,
          value: entitlement.skuId
        },
        {
          name: 'Server',
          value: entitlement.guildId || 'No Server specified'
        },
        {
          name: 'User ID',
          value: entitlement.userId 
        }
      )
      .setFooter({
        text: `Entitlement ID: ${entitlement.id}`
      })
      .setTimestamp()
    
    await eventTimeoutHandler('Entitlement', entitlement.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Entitlement Delete!',error);
  }
}